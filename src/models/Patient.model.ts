import { string } from 'joi';
import { Schema, model, Document } from 'mongoose';
import { PatientModelInterface } from '../interfaces/index';




//creating Scheme;
const PatientSchema: Schema = new Schema({
    PatientID: {
        type: String,
        required: true,
        unique: true,
    },
    FirstName: {
        type: String,
        required: true,
        unique: false,
    },
    LastName: {
        type: String,
        required: true,
        unique: false,
    },
    FatherOrHusbandName: {
        type: String,
        required: true,
        unique: false,
    },
    Email: {
        type: String,
        required: false,
        unique: false,
    },
    ContactNo: {
        type: String,
        required: true,
        unique: false,
    },
    DOB: {
        type: String,
        required: true,
        unique: false,
    },
    Age: {
        type: Number,
        required: true,
        unique: false,
    },
    Gender: {
        type: Number,
        required: true,
        unique: false,
    },
    Address: {
        type: String,
        required: false,
        unique: false,
    },
    City: {
        type: String,
        required: true,
        unique: false,
    },
    Zip: {
        type: Number,
        required: false,
        unique: false,
    },
    ReferedBy: {
        type: String,
        required: false,
        unique: false,
    },
    Status: {
        type: Number,
        required: true,
        unique: false,
    },
    Arrived: {
        type: Number,
        required: true,
        unique: false,
    },
    Documents: {
        type: [{
            type: String,
        }],
        required: true,
        unique: false,
    }

}, { timestamps: true, });

export const PatientModel = model<PatientModelInterface>("Patients", PatientSchema);

