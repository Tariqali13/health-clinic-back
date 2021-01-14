import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as Controller from "../controllers/"

class AppointmentApi {
    constructor() {
        this.AppointmentApiRouter();
    }

    public router: express.Router = express.Router();

    private AppointmentApiRouter(): void {
        // @Route POST /api/appointments/save
        // @DESC save appointments 
        // @ACCESS AUTH

        this.router.post("/save", Controller.SaveAppointment)

        // @Route GET /api/appointments/get
        // @DESC get appointments 
        // @ACCESS AUTH

        this.router.get("/get", Controller.GetAppointments)

        // @Route DELETE /api/appointments/delete
        // @DESC delete appointments 
        // @ACCESS AUTH
        this.router.delete("/delete", Controller.DeleteAppointment)

        // @Route PUT /api/appointments/update
        // @DESC update appointments 
        // @ACCESS AUTH
        this.router.put("/update",Controller.UpdateAppointment)

    }
}

export const AppointmentApiRouter = new AppointmentApi().router