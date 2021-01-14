import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as Controller from "../controllers/"

class PatientApi {
    constructor() {
        this.PatientApiRouter();
    }

    public router: express.Router = express.Router();
  
    private PatientApiRouter(): void {
        //@Route POST /api/patients/save
        //@DESC save A Patient
        //@ACCESS AUTH

        this.router.post("/save", Controller.SavingPatient)

        //@Route POST /api/patients/get
        //@DESC get All Patients
        //@ACCESS AUTH

        this.router.get("/get", Controller.GetAllPatients)

        //@Route POST /api/patients/delete
        //@DESC delete a Patients
        //@ACCESS AUTH
 
        this.router.delete("/delete", Controller.DeletePatient)
        //@Route POST /api/patients/changeArriveStatus
        //@DESC change arrive status of a Patients
        //@ACCESS AUTH

        this.router.put("/changeArriveStatus", Controller.ChangeArriveStatusOfPatient)

        //@Route POST /api/patients/updatePatient
        //@DESC Update Patient
        //@ACCESS AUTH
        this.router.put("/updatePatient",Controller.UpdatePatient)

    }
}

export const PatientApiRouter = new PatientApi().router