import { Schema, model, Document } from 'mongoose';
import { TreatmentModelInterface } from '../interfaces/index';




//creating Scheme;
const TreatmenSchema: Schema = new Schema({
    TreatmentUUID: {
        type: String,
        required: true,
        unique: true,
    },
    TreatmentGiven: {
        type: String, 
        required: true,
        unique: false,
    },
    TreatmentDate: {
        type: String, 
        required: true,
        unique: false,
    },
    TreatedByName: {
        type: String,
        required: true,
        unique: false,
    },
    PatientID: {
        type: String,
        required: true,
        unique: false,
    },
    PatientName: {
        type: String,
        required: true,
        unique: false,
    },
    TreatedByID: {
        type: String,
        required: true,
        unique: false,
    },
    Status: {
        type: String,
        required: true,
        unique: false,
    },
    Amount: {
        type: Number,
        required: true,
        unique: false,
    },
    Description: {
        type: String,
        required: true,
        unique: false,
    },
    IsPaid: {
        type: Boolean,
        required: true,
        unique: false,
    },
    Documents: {
        type: [{
            type: String,
        }],
        required: false,
    }

}, { timestamps: true, });

export const TreatmenModel = model<TreatmentModelInterface>("Treatmens", TreatmenSchema);

