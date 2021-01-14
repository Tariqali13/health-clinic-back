import * as Joi from "joi"


import {
    PatientSaveRequestInterface,
    PatientUpdateRequestInterface
} from "../../interfaces"

export const PatientSaveBodySchema: Joi.ObjectSchema<PatientSaveRequestInterface> = Joi.object({
    FirstName: Joi.string().min(2).required(),
    LastName: Joi.string().min(2).required(),
    FatherOrHusbandName: Joi.string(),
    Email: Joi.string().empty(""),
    ContactNo: Joi.string().required(),
    DOB: Joi.string(),
    Age: Joi.number(),
    Gender: Joi.number(),
    Address: Joi.string(),
    City: Joi.string(),
    Zip: Joi.number(),
    ReferedBy: Joi.string().empty(""),
    Status: Joi.number().required(),
    Arrived: Joi.number().required(),

})

export const PatientUpdateBodySchema: Joi.ObjectSchema<PatientUpdateRequestInterface> = Joi.object({
    UserID: Joi.string().required(),
    FirstName: Joi.string().min(2),
    LastName: Joi.string().min(2),
    FatherOrHusbandName: Joi.string(),
    Email: Joi.string().empty(""),
    ContactNo: Joi.string(),
    DOB: Joi.string(),
    Age: Joi.number(),
    Gender: Joi.number(),
    Address: Joi.string(),
    City: Joi.string(),
    Zip: Joi.number(),
    ReferedBy: Joi.string().empty(""),
    Status: Joi.number(),
    Arrived: Joi.number(),

})