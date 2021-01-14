import { Document } from "mongoose";

export interface TreatmentModelInterface extends Document {
    TreatmentUUID: string,
    TreatmentGiven: string,
    TreatmentDate: string,
    TreatedByName: string,
    PatientID: string,
    PatientName: string,
    TreatedByID: string,
    Status: string,
    Amount: number,
    Description: string,
    IsPaid: boolean,
    Documents: Array<string>
}


export interface TreatmentSaveBodyRequestInterface extends Document {
    TreatmentGiven: string,
    TreatmentDate: string,
    TreatedByID: string,
    PatientID: string,
    Status: string,
    Description: string,
}

export interface GetTreatmentsInterface extends Document {
    Page: string,
    Size: string,
    TreatmentID: string,
    PatientName: string,
    TreatmentGiven: string,
    TreatmentDate: string,
    TreatedBy: string,
}




export interface TreatmentUpdateBodyRequestInterface extends Document {
    TreatmentID: string,
    TreatmentGiven: string,
    TreatmentDate: string,
    TreatedByID: string,
    PatientID: string,
    Status: string,
    Description: string,
    IsPaid: boolean
}
