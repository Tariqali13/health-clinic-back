import {
    Request,
    Response,
    NextFunction
} from "express";
import {
    CustomRequest,
    PatientSaveRequestInterface,
    getAllPatientsInterface,
    PatientModelInterface,
    PatientUpdateRequestInterface
} from "../../interfaces"
import {
    PatientModel
} from "../../models"
import {
    PatientSaveBodySchema, PatientUpdateBodySchema,
} from "../validations"
import { uuid } from "uuidv4"
import { Departments, UserTypesEnum } from "../../Constants";


//@Route POST /api/patients/save
//@DESC save A Patient
//@ACCESS AUTH
export const SavingPatient = async (req: CustomRequest<PatientSaveRequestInterface>, res: Response): Promise<Response> => {

    try {
        const body: PatientSaveRequestInterface = await PatientSaveBodySchema.validateAsync(req.body)

        let validateUnique: any = false;
        if (body.Email) {
            validateUnique = await PatientModel.findOne({ Email: body.Email });

            if (validateUnique) return res.status(400).json({
                Error: true,
                Msg: `A Patient with Email ${body.Email} already exists! `,
            })
        }

        validateUnique = await PatientModel.findOne({ ContactNo: body.ContactNo });

        if (validateUnique) return res.status(400).json({
            Error: true,
            Msg: `A Patient with ContactNo ${body.ContactNo} already exists! `,
        })

        validateUnique = false;

        let newPatientID: number = Math.floor(Math.random() * 999999) + 10000;
        let same = true;
        do {
            let check = await PatientModel.findOne({ PatientID: newPatientID.toString() })

            if (!check) {
                same = false;
            }
        } while (same);

        const ToSavePatient = new PatientModel()

        ToSavePatient.PatientID = newPatientID.toString()
        ToSavePatient.FirstName = body.FirstName
        ToSavePatient.LastName = body.LastName
        ToSavePatient.FatherOrHusbandName = body.FatherOrHusbandName
        ToSavePatient.Email = body.Email || ""
        ToSavePatient.ContactNo = body.ContactNo
        ToSavePatient.DOB = body.DOB
        ToSavePatient.Age = body.Age
        ToSavePatient.Gender = body.Gender
        ToSavePatient.Address = body.Address || ""
        ToSavePatient.City = body.City
        ToSavePatient.Zip = body.Zip || 0
        ToSavePatient.ReferedBy = body.ReferedBy || ""
        ToSavePatient.Status = body.Status
        ToSavePatient.Arrived = body.Arrived

        const SavedPatient = await ToSavePatient.save()

        return res.status(200).json({
            Error: false,
            Msg: "Patient saved successfully!",
            SavedPatient,
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

//@Route POST /api/patients/get
//@DESC get All Patients
//@ACCESS AUTH

export const GetAllPatients = async (req: CustomRequest<{}, getAllPatientsInterface>, res: Response): Promise<Response> => {


    try {

        const Page: number = parseInt(req.query.Page) || 1;
        const Size: number = parseInt(req.query.Size) || 100;
        const PatientID: string = req.query.PatientID || "";
        const PatientName: string = req.query.PatientName || "";
        const Email: string = req.query.Email || "";
        const DOB: string = req.query.DOB || "";
        const Status: number = parseInt(req.query.Status) || 3;
        const Arrived: number = parseInt(req.query.Arrived) || 3;
        console.log(Arrived)


        if (Page < 1) return res.status(400).json({
            Error: true,
            TotalPages: 0,
            TotalRecords: 0,
            RecordsFound: 0,
            Msg: "Page Starts from 1",
            Patients: [],

        })
        if (Size < 1) return res.status(400).json({
            Error: true,
            TotalPages: 0,
            TotalRecords: 0,
            RecordsFound: 0,
            Msg: "Size SHould be atleast 1",
            Patients: [],

        })

        const query = {
            skip: (Page - 1) * Size,
            limit: Size,
        };

        let search = {};
        if (PatientID) search['PatientID'] = PatientID;
        if (PatientName) search['FirstName'] = ({ $regex: PatientName, $options: 'i' });
        // if (PatientName) search['LastName'] = ({ $regex: PatientName, $options: 'i' });
        if (Email) search['Email'] = ({ $regex: Email, $options: 'i' });
        if (DOB) search['DOB'] = ({ $regex: DOB, $options: 'i' });
        if (Status != 3) search['Status'] = Status;
        if (Arrived && Arrived != 3) search['Arrived'] = Arrived;

        const TotalRecords: number = await PatientModel.countDocuments(search)
        const TotalPages: number = Math.ceil(TotalRecords / Size)

        if (TotalPages < 1) return res.status(200).json({
            Error: true,
            TotalPages,
            TotalRecords,
            RecordsFound: 0,
            Msg: `No Record Found`,
            Patients: [],
        })
        if (TotalPages < Page) return res.status(400).json({
            Error: true,
            TotalPages,
            TotalRecords,
            RecordsFound: 0,
            Msg: `There are only ${TotalPages} Page/Pages And your trid to access the Page No ${Page}`,
            Patients: [],
        })
        let FoundRecords: PatientModelInterface[];

        if (Arrived === 3) {
            console.log("using sort")
            FoundRecords = await PatientModel.find(search, {}, query).sort({ Arrived: -1 })
        } else {
            FoundRecords = await PatientModel.find(search, {}, query)

        }


        const ResponseBody = {
            Error: false,
            TotalPages,
            TotalRecords,
            RecordsFound: FoundRecords.length,
            Msg: `${FoundRecords.length} Item Found`,
            Exception: null,
            Patients: FoundRecords,
        }

        return res.status(200).json(ResponseBody)


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}



//@Route POST /api/patients/delete
//@DESC delete a Patients
//@ACCESS AUTH

export const DeletePatient = async (req: CustomRequest<{}, { ID: string }>, res: Response): Promise<Response> => {


    try {

        const ID = req.query.ID;

        const Patient = await PatientModel.findOne({ _id: ID });

        if (!Patient) return res.status(400).json({
            Error: true,
            Msg: "No Patient found!",
        })


        await Patient.remove();

        return res.status(200).json({
            Error: false,
            Msg: "Patient deleted successfully!",
            DeletedUser: Patient,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}
//@Route POST /api/patients/changeArriveStatus
//@DESC change arrive status of a Patients
//@ACCESS AUTH
export const ChangeArriveStatusOfPatient = async (req: CustomRequest<{}, { ID: string }>, res: Response): Promise<Response> => {


    try {

        const ID = req.query.ID;

        const Patient = await PatientModel.findOne({ _id: ID });

        if (!Patient) return res.status(400).json({
            Error: true,
            Msg: "No Patient found!",
        })


        Patient.Arrived = Patient.Arrived == 1 ? 0 : 1

        Patient.save()

        return res.status(200).json({
            Error: false,
            Msg: "Patient arrive status updated successfully!",
            UpdatedPatient: Patient,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}

      //@Route POST /api/patients/updatePatient
        //@DESC Update Patient
        //@ACCESS AUTH

export const UpdatePatient = async (req: CustomRequest<PatientUpdateRequestInterface>, res: Response): Promise<Response> => {


    try {

        const body: PatientUpdateRequestInterface = await PatientUpdateBodySchema.validateAsync(req.body)

        const Patient = await PatientModel.findOne({ _id: body.UserID });

        if (!Patient) return res.status(400).json({
            Error: true,
            Msg: "No Patient found!",
        })

        if(body.FirstName) Patient.FirstName = body.FirstName
        if(body.LastName) Patient.LastName = body.LastName
        if(body.FatherOrHusbandName) Patient.FatherOrHusbandName = body.FatherOrHusbandName
        if(body.Email) Patient.Email = body.Email
        if(body.ContactNo) Patient.ContactNo = body.ContactNo
        if(body.DOB) Patient.DOB = body.DOB
        if(body.Age) Patient.Age = body.Age
        if(body.Gender) Patient.Gender = body.Gender
        if(body.Address) Patient.Address = body.Address
        if(body.City) Patient.City = body.City
        if(body.Zip) Patient.Zip = body.Zip
        if(body.ReferedBy) Patient.ReferedBy = body.ReferedBy
        if(body.Status) Patient.Status = body.Status
        console.log(body.Arrived)
        if(body.Arrived || body.Arrived == 0) Patient.Arrived = body.Arrived
        console.log(Patient.Arrived)
        Patient.__v = Patient.__v + 1
        await Patient.save();
        return res.status(200).json({
            Error: false,
            Msg: "Patient updated successfully!",
            Patient,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}
