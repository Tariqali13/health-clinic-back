import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as Controller from "../controllers/"

class CommonApi {
    constructor() {
        this.CommonApiRouter();
    }

    public router: express.Router = express.Router();

    private CommonApiRouter(): void {
        //@Route GET /api/common/departments
        //@DESC Get Common Departments
        //@ACCESS PUBLIC

        this.router.get("/departments", Controller.GettingDepartments)

        //@Route GET /api/common/permissions
        //@DESC Get All permissions
        //@ACCESS PUBLIC

        this.router.get("/permissions",Controller.GettingPermissions)
    }
}

export const CommonApiRouter = new CommonApi().router