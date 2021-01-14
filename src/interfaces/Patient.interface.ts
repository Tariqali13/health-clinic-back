import { Document } from "mongoose";


export interface PatientModelInterface extends Document {
    PatientID: string,
    FirstName: string,
    LastName: string,
    FatherOrHusbandName: string,
    Email: string,
    ContactNo: string,
    DOB: string,
    Age: number,
    Gender: number,
    Address: string,
    City: string,
    Zip: number,
    ReferedBy: string,
    Status: number,
    Arrived: number,
    Documents: Array<string>
}

export interface PatientSaveRequestInterface {
    FirstName: string,
    LastName: string,
    FatherOrHusbandName: string,
    Email: string,
    ContactNo: string,
    DOB: string,
    Age: number,
    Gender: number,
    Address: string,
    City: string,
    Zip: number,
    ReferedBy: string,
    Status: number,
    Arrived: number,
}

export interface getAllPatientsInterface {
    Page: string,
    Size: string,
    PatientID: string,
    PatientName: string,
    Email: string,
    DOB: string,
    Status: string,
    Arrived: string,
}


export interface PatientUpdateRequestInterface {
    UserID: string,
    FirstName: string,
    LastName: string,
    FatherOrHusbandName: string,
    Email: string,
    ContactNo: string,
    DOB: string,
    Age: number,
    Gender: number,
    Address: string,
    City: string,
    Zip: number,
    ReferedBy: string,
    Status: number,
    Arrived: number,
}
