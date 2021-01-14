import { Document } from "mongoose";



export interface AppointmentModalInterface extends Document {
    PatientID: string,
    PatientName: string,
    TreatedByID: string,
    TreatedByName: string,
    TreatmentGiven: string,
    TreatmentTime: string,
    TreatmentDate: string,
}

export interface AppointmentSaveBodyRequestInterface {
    PatientID: string,
    PatientName: string,
    TreatedByID: string,
    TreatedByName: string,
    TreatmentGiven: string,
    TreatmentTime: string,
    TreatmentDate: string,
    TreatmentID?: string,

}

export interface AppointmentGetRequestInterface {
    PatientName: string,
    TreatmentGiven: string,
    TreatedByName: string,
    Page: string,
    Size: string,

}
