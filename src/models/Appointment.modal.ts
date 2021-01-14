import { string } from 'joi';
import { Schema, model, Document } from 'mongoose';
import { AppointmentModalInterface } from '../interfaces/index';




//creating Scheme;
const AppointmentSchema: Schema = new Schema({
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
    TreatmentGiven: {
        type: String,
        required: true,
        unique: false,
    },
    TreatmentTime: {
        type: String,
        required: true,
        unique: false,
    },
    TreatmentDate:{
        type: String,
        required: true,
        unique: false,
    },
    TreatedByID:{
        type: String,
        required: true,
        unique: false,
    },
    TreatedByName:{
        type: String,
        required: true,
        unique: false,
    },

}, { timestamps: true, });

export const AppointmentModal = model<AppointmentModalInterface>("Appointments", AppointmentSchema);

