import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    Departments,
    Permissions
} from "../../Constants"

//@Route GET /api/common/departments
//@DESC Get Common Departments
//@ACCESS PUBLIC

export const GettingDepartments = async (req: Request, res: Response): Promise<Response> => {

    try {

        return res.status(200).json({
            Error: false,
            Msg: "Data retrieved successfully!",
            Data: Departments,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}

//@Route GET /api/common/permissions
//@DESC Get All permissions
//@ACCESS PUBLIC
export const GettingPermissions = async (req: Request, res: Response): Promise<Response> => {

    try {

        return res.status(200).json({
            Error: false,
            Msg: "Data retrieved successfully!",
            Data: Permissions,
        })

    } catch (error) {
        return res.status(500).json({
            Error: true,
            Msg: "Something broke on the server, check the exception below",
            Exception: error,
        })
    }
}
