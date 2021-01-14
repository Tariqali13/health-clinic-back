import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as Controller from "../controllers/"

class TreatmentApi {
    constructor() {
        this.TreatmentApiRouter();
    }

    public router: express.Router = express.Router();

    private TreatmentApiRouter(): void {
        //@Route POST /api/treatments/save
        //@DESC Save Treatment 
        //@ACCESS AUTH

        this.router.post("/save", Controller.SaveTreatment)

        //@Route GET /api/treatments/get
        //@DESC Get Treatments
        //@ACCESS AUTH

        this.router.get("/get", Controller.GetAllTreatments)

        //@Route DELETE /api/treatments/delete
        //@DESC Delete Treatments
        //@ACCESS AUTH
        this.router.delete("/delete", Controller.DeleteTreatment)

        //@Route PUT /api/treatments/update
        //@DESC update Treatments
        //@ACCESS AUTH
        this.router.put("/update", Controller.UpdateTreatment)

    }
}

export const TreatmentApiRouter = new TreatmentApi().router