import { Request, Response, NextFunction } from "express";
const SecretKey = "QWERTYUIOPASDFGHJKLZXCVBNMMLPOKMNIUHBVGYFCDEWQASX7890-543215tgbnhy6"
export const ApiAuth = (req: Request, res: Response, next: NextFunction): void | Response => {

    if (!req.headers['auth-system']) return res.status(400).json({ error: "true", msg: "No Api Key Token Provided" })

    if (req.headers['auth-system'] != SecretKey) return res.status(400).json({
        Error: "true",
        Msg: "In Valid Api Key Token Provided"
    });



    next()

}