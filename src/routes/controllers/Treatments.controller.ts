import {
    Request,
    Response,
    NextFunction
} from "express";
import {
    CustomRequest,
    TreatmentModelInterface,
    TreatmentSaveBodyRequestInterface,
    GetTreatmentsInterface,
    TreatmentUpdateBodyRequestInterface
} from "../../interfaces"
import {
    TreatmenModel,
    UserModel,
    PatientModel
} from "../../models"
import {
    TreatmentSaveBodySchema, TreatmentUpdateBodySchema
} from "../validations"
import { uuid } from "uuidv4"
import { Departments, UserTypesEnum } from "../../Constants";

//@Route GET /api/treatments/save
//@DESC Get Treatment Departments
//@ACCESS AUTH
export const SaveTreatment = async (req: CustomRequest<TreatmentSaveBodyRequestInterface>, res: Response): Promise<Response> => {
    try {
        const body: TreatmentSaveBodyRequestInterface = await TreatmentSaveBodySchema.validateAsync(req.body)

        const doctore = await UserModel.findOne({ _id: body.TreatedByID })

        if (!doctore) return res.status(400).json({
            Error: true,
            Msg: `Doctor not found`,
        })

        const patient = await PatientModel.findOne({ _id: body.PatientID })

        if (!patient) return res.status(400).json({
            Error: true,
            Msg: `Patient not found`,
        })

        let newTreatmentID: number = Math.floor(Math.random() * 999999) + 10000;
        let same = true;
        do {
            let check = await TreatmenModel.findOne({ PatientID: newTreatmentID.toString() })

            if (!check) {
                same = false;
            }
        } while (same);

        const ToSaveTreatment = new TreatmenModel()

        ToSaveTreatment.TreatmentUUID = newTreatmentID.toString()
        ToSaveTreatment.TreatmentGiven = body.TreatmentGiven;
        ToSaveTreatment.TreatmentDate = body.TreatmentDate;
        ToSaveTreatment.TreatedByName = doctore.Name;
        ToSaveTreatment.PatientID = body.PatientID;
        ToSaveTreatment.PatientName = patient.FirstName + " " + patient.LastName;
        ToSaveTreatment.TreatedByID = body.TreatedByID;
        ToSaveTreatment.Status = body.Status;
        ToSaveTreatment.Amount = doctore.GeneralCharges;
        ToSaveTreatment.Description = body.Description;
        ToSaveTreatment.IsPaid = false;
        ToSaveTreatment.IsPaid = false;

        const SavedTreatment = await ToSaveTreatment.save()

        return res.status(200).json({
            Error: false,
            Msg: "Treatment saved successfully!",
            SavedTreatment,
        })



    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: error?.details && error?.details[0]?.message || "Something broke on the server, check the exception below",
            Exception: error?.details && error?.details[0] || error,

        })
    }

}

//@Route GET /api/treatments/get
//@DESC Get Treatments
//@ACCESS AUTH

export const GetAllTreatments = async (req: CustomRequest<{}, GetTreatmentsInterface>, res: Response): Promise<Response> => {


    try {

        const Page: number = parseInt(req.query.Page) || 1;
        const Size: number = parseInt(req.query.Size) || 100;
        const TreatmentID: string = req.query.TreatmentID || "";
        const PatientName: string = req.query.PatientName || "";
        const TreatmentGiven: string = req.query.TreatmentGiven || "";
        const TreatmentDate: string = req.query.TreatmentDate || "";
        const TreatedBy: string = req.query.TreatedBy || "";


        if (Page < 1) return res.status(400).json({
            Error: true,
            TotalPages: 0,
            TotalRecords: 0,
            RecordsFound: 0,
            Msg: "Page Starts from 1",
            Treatments: [],

        })
        if (Size < 1) return res.status(400).json({
            Error: true,
            TotalPages: 0,
            TotalRecords: 0,
            RecordsFound: 0,
            Msg: "Size SHould be atleast 1",
            Treatments: [],

        })

        const query = {
            skip: (Page - 1) * Size,
            limit: Size,
        };

        let search = {};
        if (TreatmentID) search['TreatmentID'] = TreatmentID;
        if (PatientName) search['PatientName'] = ({ $regex: PatientName, $options: 'i' });
        if (TreatmentGiven) search['TreatmentGiven'] = ({ $regex: TreatmentGiven, $options: 'i' });
        if (TreatmentDate) search['TreatmentDate'] = ({ $regex: TreatmentDate, $options: 'i' });
        if (TreatedBy) search['TreatedByName'] = ({ $regex: TreatedBy, $options: 'i' });

        const TotalRecords: number = await TreatmenModel.countDocuments(search)
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
        let FoundRecords: TreatmentModelInterface[];

        FoundRecords = await TreatmenModel.find(search, {}, query).sort({ createdAt: -1 })


        const ResponseBody = {
            Error: false,
            TotalPages,
            TotalRecords,
            RecordsFound: FoundRecords.length,
            Msg: `${FoundRecords.length} Item Found`,
            Exception: null,
            Treatments: FoundRecords,
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
// DeleteTreatment



//@Route DELETE /api/treatments/delete
//@DESC Delete Treatments
//@ACCESS AUTH
export const DeleteTreatment = async (req: CustomRequest<{}, { ID: string }>, res: Response): Promise<Response> => {


    try {

        const ID = req.query.ID;

        const Treatment = await TreatmenModel.findOne({ _id: ID });

        if (!Treatment) return res.status(400).json({
            Error: true,
            Msg: "No Treatment found!",
        })


        await Treatment.remove();

        return res.status(200).json({
            Error: false,
            Msg: "Treatment deleted successfully!",
            DeletedTreatment: Treatment,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}

//@Route PUT /api/treatments/update
//@DESC update Treatments
//@ACCESS AUTH

export const UpdateTreatment = async (req: CustomRequest<TreatmentUpdateBodyRequestInterface>, res: Response): Promise<Response> => {


    try {

        const body: TreatmentUpdateBodyRequestInterface = await TreatmentUpdateBodySchema.validateAsync(req.body)

        const Treatment = await TreatmenModel.findOne({ _id: body.TreatmentID });

        if (!Treatment) return res.status(400).json({
            Error: true,
            Msg: "No Treatment found!",
        })

        if (body.TreatmentGiven) Treatment.TreatmentGiven = body.TreatmentGiven
        if (body.TreatmentDate) Treatment.TreatmentDate = body.TreatmentDate
        if (body.TreatedByID) Treatment.TreatedByID = body.TreatedByID
        if (body.PatientID) Treatment.PatientID = body.PatientID
        if (body.Status) Treatment.Status = body.Status
        if (body.Description) Treatment.Description = body.Description
        if (body.IsPaid) Treatment.IsPaid = body.IsPaid


        Treatment.__v = Treatment.__v + 1
        await Treatment.save();
        return res.status(200).json({
            Error: false,
            Msg: "Treatment updated successfully!",
            Treatment,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}