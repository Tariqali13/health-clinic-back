import * as express from "express";
import * as config from "config"
import { Request, Response } from "express";
import {
    UserApiRouter,
    CommonApiRouter,
    PatientApiRouter,
    TreatmentApiRouter,
    AppointmentApiRouter
} from "./routes/api/"
import { connect } from "mongoose"
import * as cors from "cors"
import { ApiAuth } from "./routes/security/"
import * as morgan from "morgan"
class App {

    constructor() {
        this.app = express();
        this.config();
        this.initDB();
        this.routes();
    }
    public express: express.Express
    public app: express.Application;


    private config(): void {
        this.app.use(cors())
        this.app.use(ApiAuth)

        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(morgan("dev"))
    }
    private initDB(): void {
        connect(config.get("mongodbCloudUrl"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(() => {
            console.log("DB Connected to Health Clinic DB")
        }).catch((err => {
            throw err;
        }))
    }
    private routes(): void {
        this.app.use('/api/users', UserApiRouter)
        this.app.use('/api/patients', PatientApiRouter)
        this.app.use('/api/treatments', TreatmentApiRouter)
        this.app.use("/api/appointments", AppointmentApiRouter)
        this.app.use('/api/common', CommonApiRouter)

        this.app.use("*", (req: Request, res: Response): Response => {

            return res.status(404).json({
                Error: true,
                Msg: `the Endpoint ${req.originalUrl} with the method ${req.method} Is not hosted on our server!`
            })
        })
    }

}
export default new App().app;
