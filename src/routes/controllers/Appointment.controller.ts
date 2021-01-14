import {
    Request,
    Response,
    NextFunction
} from "express";
import {
    CustomRequest,
    AppointmentModalInterface,
    AppointmentSaveBodyRequestInterface,
    AppointmentGetRequestInterface
} from "../../interfaces"
import {
    AppointmentModal, PatientModel, UserModel
} from "../../models"
import {
    PatientSaveBodySchema, PatientUpdateBodySchema,
} from "../validations"
import { uuid } from "uuidv4"
import { Departments, UserTypesEnum } from "../../Constants";

// @Route POST /api/appointments/save
// @DESC save appointments 
// @ACCESS AUTH

export const SaveAppointment = async (req: CustomRequest<AppointmentSaveBodyRequestInterface>, res: Response, next: NextFunction): Promise<Response> => {
    try {

        const {
            PatientID,
            PatientName,
            TreatmentGiven,
            TreatmentTime,
            TreatmentDate,
            TreatedByID,
            TreatedByName
        } = req.body

        if (!PatientID) return res.status(400).json({
            Error: true,
            Msg: "Please send a patient ID",

        })
        if (!PatientName) return res.status(400).json({
            Error: true,
            Msg: "Please send a patient name",

        })
        if (!TreatmentGiven) return res.status(400).json({
            Error: true,
            Msg: "Please select a treatment",

        })
        if (!TreatmentDate) return res.status(400).json({
            Error: true,
            Msg: "Please select a treatment date",

        })
        if (!TreatmentTime) return res.status(400).json({
            Error: true,
            Msg: "Please select a treatment time",

        })
        if (!TreatedByID) return res.status(400).json({
            Error: true,
            Msg: "Please send a Treated By ID",

        })
        if (!TreatedByName) return res.status(400).json({
            Error: true,
            Msg: "Please send a Treated By name",

        })
        const doctore = await UserModel.findOne({ _id: TreatedByID })

        if (!doctore) return res.status(400).json({
            Error: true,
            Msg: `Doctor not found`,
        })

        const patient = await PatientModel.findOne({ _id: PatientID })

        if (!patient) return res.status(400).json({
            Error: true,
            Msg: `Patient not found`,
        })

        const body = {
            PatientID: patient._id,
            PatientName: patient.FirstName + " " + patient.LastName,
            TreatmentGiven,
            TreatmentTime,
            TreatmentDate,
            TreatedByID: doctore._id,
            TreatedByName: doctore.Name,
        }

        const SavedAppointment = await AppointmentModal.create(body);

        return res.status(200).json({
            Error: false,
            Msg: "Appointment created successfully",
            SavedAppointment,
        })
    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}

// @Route GET /api/appointments/get
// @DESC get appointments 
// @ACCESS AUTH
export const GetAppointments = async (req: CustomRequest<{}, AppointmentGetRequestInterface>, res: Response): Promise<Response> => {


    try {

        const Page: number = parseInt(req.query.Page) || 1;
        const Size: number = parseInt(req.query.Size) || 100;
        const PatientName: string = req.query.PatientName || "";
        const TreatedByName: string = req.query.TreatedByName || "";
        const TreatmentGiven: string = req.query.TreatmentGiven || "";


        if (Page < 1) return res.status(400).json({
            Error: true,
            TotalPages: 0,
            TotalRecords: 0,
            RecordsFound: 0,
            Msg: "Page Starts from 1",
            Appointments: [],

        })
        if (Size < 1) return res.status(400).json({
            Error: true,
            TotalPages: 0,
            TotalRecords: 0,
            RecordsFound: 0,
            Msg: "Size SHould be atleast 1",
            Appointments: [],

        })

        const query = {
            skip: (Page - 1) * Size,
            limit: Size,
        };

        let search = {};
        if (PatientName) search['PatientName'] = ({ $regex: PatientName, $options: 'i' });
        if (TreatmentGiven) search['TreatmentGiven'] = ({ $regex: TreatmentGiven, $options: 'i' });
        if (TreatedByName) search['TreatedByName'] = ({ $regex: TreatedByName, $options: 'i' });

        const TotalRecords: number = await AppointmentModal.countDocuments(search)
        const TotalPages: number = Math.ceil(TotalRecords / Size)

        if (TotalPages < 1) return res.status(200).json({
            Error: true,
            TotalPages,
            TotalRecords,
            RecordsFound: 0,
            Msg: `No Record Found`,
            Appointments: [],
        })
        if (TotalPages < Page) return res.status(400).json({
            Error: true,
            TotalPages,
            TotalRecords,
            RecordsFound: 0,
            Msg: `There are only ${TotalPages} Page/Pages And your trid to access the Page No ${Page}`,
            Appointments: [],
        })
        let FoundRecords: AppointmentModalInterface[];

        FoundRecords = await AppointmentModal.find(search, {}, query).sort({ createdAt: -1 })


        const ResponseBody = {
            Error: false,
            TotalPages,
            TotalRecords,
            RecordsFound: FoundRecords.length,
            Msg: `${FoundRecords.length} Item Found`,
            Exception: null,
            Appointments: FoundRecords,
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

// @Route DELETE /api/appointments/delete
// @DESC delete appointments 
// @ACCESS AUTH


export const DeleteAppointment = async (req: CustomRequest<{}, { ID: string }>, res: Response): Promise<Response> => {


    try {

        const ID = req.query.ID;

        const Appointment = await AppointmentModal.findOne({ _id: ID });

        if (!Appointment) return res.status(400).json({
            Error: true,
            Msg: "No Appointment found!",
        })


        await Appointment.remove();

        return res.status(200).json({
            Error: false,
            Msg: "Appointment deleted successfully!",
            DeletedAppointment: Appointment,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}

// @Route PUT /api/appointments/update
// @DESC update appointments 
// @ACCESS AUTH

export const UpdateAppointment = async (req: CustomRequest<AppointmentSaveBodyRequestInterface>, res: Response): Promise<Response> => {


    try {

        const body: AppointmentSaveBodyRequestInterface = req.body;

        const Appointment = await AppointmentModal.findOne({ _id: body.TreatmentID });

        if (!Appointment) return res.status(400).json({
            Error: true,
            Msg: "No Appointment found!",
        })

        if (body.PatientID) Appointment.PatientID = body.PatientID
        if (body.PatientName) Appointment.PatientName = body.PatientName
        if (body.TreatmentGiven) Appointment.TreatmentGiven = body.TreatmentGiven
        if (body.TreatmentTime) Appointment.TreatmentTime = body.TreatmentTime
        if (body.TreatmentDate) Appointment.TreatmentDate = body.TreatmentDate
        if (body.TreatedByID) Appointment.TreatedByID = body.TreatedByID
        if (body.TreatedByName) Appointment.TreatedByName = body.TreatedByName


        Appointment.__v = Appointment.__v + 1
        await Appointment.save();
        return res.status(200).json({
            Error: false,
            Msg: "Appointment updated successfully!",
            Appointment,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}