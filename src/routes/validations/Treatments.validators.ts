import * as Joi from "joi"


import {
    TreatmentSaveBodyRequestInterface, TreatmentUpdateBodyRequestInterface
} from "../../interfaces"

export const TreatmentSaveBodySchema: Joi.ObjectSchema<TreatmentSaveBodyRequestInterface> = Joi.object({
    TreatmentGiven: Joi.string().min(2).required(),
    TreatmentDate: Joi.string(),
    TreatedByID: Joi.string(),
    PatientID: Joi.string(),
    Status: Joi.string(),
    Description: Joi.string(),
})


export const TreatmentUpdateBodySchema: Joi.ObjectSchema<TreatmentUpdateBodyRequestInterface> = Joi.object({
    TreatmentID: Joi.string(),
    TreatmentGiven: Joi.string().min(2),
    TreatmentDate: Joi.string(),
    TreatedByID: Joi.string(),
    PatientID: Joi.string(),
    Status: Joi.string(),
    Description: Joi.string(),
    IsPaid: Joi.boolean(),
})