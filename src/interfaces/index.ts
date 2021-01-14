import { Document } from 'mongoose';
import { Request } from "express"
import { ParsedQs } from "qs";

export interface CustomRequest<T, P ={} > extends Request {
    body: T,
    query: P,
}

export * from "./Users.interface"
export * from "./Patient.interface"
export * from "./Treatments.interface"
export * from "./Appointment.interface"