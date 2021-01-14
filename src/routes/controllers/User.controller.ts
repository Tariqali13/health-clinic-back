import {
    Request,
    Response,
    NextFunction
} from "express";
import {
    CustomRequest,
    UserSaveRequestInterface,
    UserModelInterface,
    loginRequestInterface,
    UserUpdateRequestInterface,
    deleteUserRequestInterface,
    getAllUsersInterface,
    changePasswordRequestInterface,
    changeDefaultPasswordRequestInterface,
    RequestCodeForNewPasswordInterface,
    ChangePasswordWithCodeInterface
} from "../../interfaces"
import {
    UserModel,
} from "../../models"
import {
    ChangeDefaultPasswordSchema,
    ChangePasswordSchema,
    ChangePasswordWithCodeSchema,
    DeleteUserBodySchema,
    LoginBodySchema,
    RequestCodeForNewPasswordSchema,
    UserSaveBodySchema,
    UserUpdateBodySchema,

} from "../validations"
import { uuid } from "uuidv4"
import * as bcrypt from "bcrypt"
import * as JWT from "jsonwebtoken"
import { Departments, UserTypesEnum } from "../../Constants";
import { get } from "config"
import { transporter } from "../../helpers/emailSender";

import * as sgMail from '@sendgrid/mail'
sgMail.setApiKey("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")



//@Route POST /api/users/save
//@DESC save A User
//@ACCESS AUTH
export const SavingUser = async (req: CustomRequest<UserSaveRequestInterface>, res: Response): Promise<Response> => {

    try {
        const body: UserSaveRequestInterface = await UserSaveBodySchema.validateAsync(req.body)

        let match = await UserModel.findOne({ Username: body.Username })
        if (match) return res.status(400).json({
            Error: true,
            Msg: `A User with Username ${body.Username} already exists! `,
        })

        match = await UserModel.findOne({ Email: body.Email });

        if (match) return res.status(400).json({
            Error: true,
            Msg: `A User with Email ${body.Email} already exists! `,
        })

        match = await UserModel.findOne({ PhoneNo: body.PhoneNo });

        if (match) return res.status(400).json({
            Error: true,
            Msg: `A User with PhoneNo ${body.PhoneNo} already exists! `,
        })


        const password = uuid().substring(0, 8);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const ToSaveUser = new UserModel()

        ToSaveUser.Username = body.Username;
        ToSaveUser.Email = body.Email;
        ToSaveUser.PhoneNo = body.PhoneNo || "";
        ToSaveUser.Name = body.Name;
        ToSaveUser.Password = hash;
        ToSaveUser.DepartmentID = body.DepartmentID;
        ToSaveUser.DepartmentName = Departments.filter(x => x.Value == body.DepartmentID)[0]?.Label || "N/A";
        ToSaveUser.GeneralCharges = body.GeneralCharges || 0;
        ToSaveUser.Qualification = body.Qualification || "N/A";
        ToSaveUser.UserTypeID = body.UserTypeID;
        ToSaveUser.IsDefaultPasswordChanged = false;
        ToSaveUser.UserType = body.UserTypeID == 1 ? "Doctor" : body.UserTypeID == 2 ? "Admin" : body.UserTypeID == 3 ? "Staff" : "invalid"
        ToSaveUser.Permissions = body.PermissionsArray;

        const SavedUser = await ToSaveUser.save()





        const msg = {
            from: "asim.bilal@rsglowtech.com", // sender address
            to: body.Email, // list of receivers
            subject: "Your new password", // Subject line
            text: "Welcome", // plain text body
            html: `
            <div>
            <h1>Hii ${body.Name}, Welcome to Medi Health Clinic!</h1>
            <h2> Your new password is: ${password} <h2>
            <div/>
            `, // html body
        }
        const info = await sgMail.send(msg);

        return res.status(200).json({
            Error: false,
            Msg: "User saved successfully!",
            SavedUser,
            // Token,
        })



    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details && error?.details[0] || error,

        })
    }
}


//@Route POST /api/users/login
//@DESC Logins in a user
//@ACCESS PUBLIC
export const LoginUser = async (req: CustomRequest<loginRequestInterface>, res: Response): Promise<Response> => {


    try {

        const body: loginRequestInterface = await LoginBodySchema.validateAsync(req.body)

        const User = await UserModel.findOne({ Email: body.Email });

        if (!User) return res.status(400).json({
            Error: true,
            Msg: "No user found with the provided email!",
        })

        const match: boolean = await bcrypt.compare(body.Password, User.Password)

        if (!match) return res.status(400).json({
            Error: true,
            Msg: "Invalid Credientials",
        })


        const Token = JWT.sign(
            {
                _id: User._id,
                UserTypeID: User.UserTypeID,
            },
            get("jwtSecret"),
            { expiresIn: "365d" }
        )


        return res.status(200).json({
            Error: false,
            Msg: "Login Successfull!",
            UserData: User,
            Token,
        })




    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details[0],
        })
    }
}


//@Route PUT /api/users/update
//@DESC updates a user
//@ACCESS AUTH


export const UpdateUser = async (req: CustomRequest<UserUpdateRequestInterface>, res: Response): Promise<Response> => {


    try {

        const body: UserUpdateRequestInterface = await UserUpdateBodySchema.validateAsync(req.body)


        const User = await UserModel.findOne({ _id: body.UserID });

        if (!User) return res.status(400).json({
            Error: true,
            Msg: "No user found!",
        })




        if (body.Username) User.Username = body.Username;
        if (body.Email) User.Email = body.Email;
        if (body.PhoneNo) User.PhoneNo = body.PhoneNo;
        if (body.Name) User.Name = body.Name;
        if (body.DepartmentID) User.DepartmentID = body.DepartmentID;
        if (body.DepartmentID) User.DepartmentName = Departments.filter(x => x.Value == body.DepartmentID)[0].Label || "";
        if (body.GeneralCharges) User.GeneralCharges = body.GeneralCharges;
        if (body.Qualification) User.Qualification = body.Qualification;
        if (body.UserTypeID) User.UserTypeID = body.UserTypeID;
        if (body.UserTypeID) User.UserType = body.UserTypeID == 1 ? "Doctor" : body.UserTypeID == 2 ? "Admin" : body.UserTypeID == 3 ? "Staff" : "invalid"
        if (body.PermissionsArray) User.Permissions = body.PermissionsArray;

        User.__v = User.__v + 1
        await User.save();
        return res.status(200).json({
            Error: false,
            Msg: "User updated successfully!",
            User,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details[0],
        })
    }
}




//@Route DELETE /api/users/delete
//@DESC Delets a user
//@ACCESS AUTH
export const DeleteUser = async (req: CustomRequest<{}, deleteUserRequestInterface>, res: Response): Promise<Response> => {


    try {

        const body: deleteUserRequestInterface = await DeleteUserBodySchema.validateAsync(req.query)

        const User = await UserModel.findOne({ _id: body.UserID });

        if (!User) return res.status(400).json({
            Error: true,
            Msg: "No user found!",
        })


        await User.remove();

        return res.status(200).json({
            Error: false,
            Msg: "User deleted successfully!",
            DeletedUser: User,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details[0],
        })
    }
}


//@Route GET /api/users/get
//@DESC Get all users
//@ACCESS AUTH

export const GetAllUsers = async (req: CustomRequest<{}, getAllUsersInterface>, res: Response): Promise<Response> => {


    try {

        const Page: number = parseInt(req.query.Page) || 1;
        const Size: number = parseInt(req.query.Size) || 100;
        const Name: string = req.query.Name || "";
        const Email: string = req.query.Email || "";
        const PhoneNo: string = req.query.PhoneNo || "";
        const Type: number = parseInt(req.query.Type) || 0;
        const Department: string = req.query.Department || "";
        const GeneralCharges: number = parseInt(req.query.GeneralCharges) || 0;



        if (Page < 1) return res.status(400).json({
            Error: true,
            TotalPages: 0,
            TotalRecords: 0,
            RecordsFound: 0,
            Msg: "Page Starts from 1",
            Users: [],

        })
        if (Size < 1) return res.status(400).json({
            Error: true,
            TotalPages: 0,
            TotalRecords: 0,
            RecordsFound: 0,
            Msg: "Size SHould be atleast 1",
            Users: [],

        })

        const query = {
            skip: (Page - 1) * Size,
            limit: Size,
        };

        let search = {};
        if (Name) search['Name'] = ({ $regex: Name, $options: 'i' });
        if (Email) search['Email'] = ({ $regex: Email, $options: 'i' });
        if (PhoneNo) search['PhoneNo'] = ({ $regex: PhoneNo, $options: 'i' });
        if (Type && Type != 0) search['UserTypeID'] = Type;
        if (!Department) search['DepartmentName'] = ({ $regex: Department, $options: 'i' });
        if (GeneralCharges && GeneralCharges != 0) search['GeneralCharges'] = GeneralCharges;

        const TotalRecords: number = await UserModel.countDocuments(search)
        const TotalPages: number = Math.ceil(TotalRecords / Size)

        if (TotalPages < 1) return res.status(200).json({
            Error: true,
            TotalPages,
            TotalRecords,
            RecordsFound: 0,
            Msg: `No Record Found`,
            Users: [],
        })
        if (TotalPages < Page) return res.status(400).json({
            Error: true,
            TotalPages,
            TotalRecords,
            RecordsFound: 0,
            Msg: `There are only ${TotalPages} Page/Pages And your trid to access the Page No ${Page}`,
            Users: [],
        })

        const FoundRecords: UserModelInterface[] = await UserModel.find(search, {}, query).sort({ createdAt: -1 });
        

        const ResponseBody = {
            Error: false,
            TotalPages,
            TotalRecords,
            RecordsFound: FoundRecords.length,
            Msg: `${FoundRecords.length} Item Found`,
            Exception: null,
            Users: FoundRecords,
        } 

        return res.status(200).json(ResponseBody)


    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details && error?.details[0] || error,
        })
    }
}


//@Route POST /api/users/changepassword
//@DESC Change password of a user
//@ACCESS AUTH

export const changePassword = async (req: CustomRequest<changePasswordRequestInterface>, res: Response): Promise<Response> => {


    try {

        const body: changePasswordRequestInterface = await ChangePasswordSchema.validateAsync(req.body)

        const User = await UserModel.findOne({ _id: body.UserID });

        if (!User) return res.status(400).json({
            Error: true,
            Msg: "No user found!",
        })


        const match: boolean = await bcrypt.compare(body.OldPassword, User.Password);

        if (!match) return res.status(400).json({
            Error: true,
            Msg: "Old password is incorrect!"
        })

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(body.NewPassword, salt);

        User.Password = hash;

        await User.save()


        return res.status(200).json({
            Error: false,
            Msg: "Password updated successfully!",

        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details[0],
        })
    }
}


//@Route PUT /api/users/updateDefaultPassword
//@DESC Update default Password
//@ACCESS AUTH

export const changeDefaultPassword = async (req: CustomRequest<changeDefaultPasswordRequestInterface>, res: Response): Promise<Response> => {


    try {

        const body: changeDefaultPasswordRequestInterface = await ChangeDefaultPasswordSchema.validateAsync(req.body)

        const User = await UserModel.findOne({ _id: body.UserID });

        if (!User) return res.status(400).json({
            Error: true,
            Msg: "No user found!",
        })

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(body.NewPassword, salt);

        User.Password = hash;
        User.IsDefaultPasswordChanged = true

        await User.save()


        return res.status(200).json({
            Error: false,
            Msg: "Password updated successfully!",

        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details[0],
        })
    }
}


//@Route POST /api/users/requestCodeForNewPassword
//@DESC Request code for new password
//@ACCESS AUTH
const Codes = [1252, 56232, 42323, 576545, 23213, 767675, 232345, 1212, 56563, 132124, 6563, 98665, 2323546, 2323, 6564, 232346, 5634, 2683]

export const requestCodeForNewPassword = async (req: CustomRequest<RequestCodeForNewPasswordInterface>, res: Response): Promise<Response> => {


    try {

        const body: RequestCodeForNewPasswordInterface = await RequestCodeForNewPasswordSchema.validateAsync(req.body)

        const User = await UserModel.findOne({ Email: body.Email });

        if (!User) return res.status(400).json({
            Error: true,
            Msg: "No user found!",
        })


        const msg = {
            from: "asim.bilal@rsglowtech.com", // sender address
            to: body.Email, // list of receivers
            subject: "Reset password security code", // Subject line
            text: "Welcome", // plain text body
            html: `
            <div>
            <h2>Hii ${User.Name},Use the following code to reset your password:</h2>
            <h3> Code: ${Codes[Math.floor((Math.random() * Codes.length - 1) + 0)]} <h3>
            <div/>
            `, // html body
        }
        const info = await sgMail.send(msg);


        return res.status(200).json({
            Error: false,
            Msg: "Email sent with reset code!",

        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details[0],
        })
    }
}
//@Route POST /api/users/changePasswordWithCode
//@DESC Change Password with code
//@ACCESS AUTH


export const changePasswordWithCode = async (req: CustomRequest<ChangePasswordWithCodeInterface>, res: Response): Promise<Response> => {


    try {

        const body: ChangePasswordWithCodeInterface = await ChangePasswordWithCodeSchema.validateAsync(req.body)

        const User = await UserModel.findOne({ Email: body.Email });

        if (!User) return res.status(400).json({
            Error: true,
            Msg: "No user found!",
        })

        if (!Codes.includes(parseInt(body.Code))) return res.status(400).json({
            Error: true,
            Msg: "Invalid security code entered!",
        })

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(body.NewPassword, salt);

        User.Password = hash;
        User.IsDefaultPasswordChanged = true

        await User.save()


        return res.status(200).json({
            Error: false,
            Msg: "Password updated successfully!",

        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details[0],
        })
    }
}
