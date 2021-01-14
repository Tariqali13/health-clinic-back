import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as Controller from "../controllers/"

class UserApi {
    constructor() {
        this.UserApiRouter();
    }

    public router: express.Router = express.Router();

    private UserApiRouter(): void {
        //@Route POST /api/users/save
        //@DESC save A User
        //@ACCESS AUTH

        this.router.post("/save", Controller.SavingUser)

        //@Route POST /api/users/login
        //@DESC Logins in a user
        //@ACCESS PUBLIC
        this.router.post("/login", Controller.LoginUser)


        //@Route PUT /api/users/update
        //@DESC updates a user
        //@ACCESS AUTH
        this.router.put("/update", Controller.UpdateUser)

        //@Route DELETE /api/users/delete
        //@DESC Delets a user
        //@ACCESS AUTH

        this.router.delete("/delete", Controller.DeleteUser)


        //@Route GET /api/users/get
        //@DESC Get all users
        //@ACCESS AUTH

        this.router.get("/get", Controller.GetAllUsers)

        //@Route POST /api/users/changepassword
        //@DESC Change password of a user
        //@ACCESS AUTH

        this.router.put("/changepassword", Controller.changePassword);


        //@Route POST /api/users/updateDefaultPassword
        //@DESC Update default Password
        //@ACCESS AUTH

        this.router.put("/updateDefaultPassword", Controller.changeDefaultPassword);

        //@Route POST /api/users/requestCodeForNewPassword
        //@DESC Request code for new password
        //@ACCESS AUTH

        this.router.post("/requestCodeForNewPassword", Controller.requestCodeForNewPassword)

        //@Route POST /api/users/changePasswordWithCode
        //@DESC Change Password with code
        //@ACCESS AUTH
        this.router.post("/changePasswordWithCode",Controller.changePasswordWithCode)

    }
}

export const UserApiRouter = new UserApi().router