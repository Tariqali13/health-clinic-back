

import * as Joi from "joi"
import {
    UserSaveRequestInterface,
    loginRequestInterface,
    UserUpdateRequestInterface,
    deleteUserRequestInterface,
    changePasswordRequestInterface,
    changeDefaultPasswordRequestInterface,
    RequestCodeForNewPasswordInterface,
    ChangePasswordWithCodeInterface
} from "../../interfaces"

export const UserSaveBodySchema: Joi.ObjectSchema<UserSaveRequestInterface> = Joi.object({
    Username: Joi.string().min(2).required(),
    Email: Joi.string().email().required(),
    PhoneNo: Joi.string(),
    Name: Joi.string().required(),
    DepartmentID: Joi.number(),
    GeneralCharges: Joi.number(),
    Qualification: Joi.string(),
    UserTypeID: Joi.number().valid(1, 2, 3).required(),
    PermissionsArray: Joi.array().items(Joi.string().required()).min(1).required(),

})

export const LoginBodySchema: Joi.ObjectSchema<loginRequestInterface> = Joi.object({
    Email: Joi.string().email().required(),
    Password: Joi.string().required()

})

export const UserUpdateBodySchema: Joi.ObjectSchema<UserUpdateRequestInterface> = Joi.object({
    UserID: Joi.string().min(24).max(24).required(),
    Username: Joi.string().min(5),
    Email: Joi.string().email(),
    PhoneNo: Joi.string().min(7),
    Name: Joi.string(),
    DepartmentID: Joi.number().min(1),
    GeneralCharges: Joi.number().min(100).max(1000000),
    Qualification: Joi.string(),
    UserTypeID: Joi.number().valid(1, 2, 3),
    PermissionsArray: Joi.array().items(Joi.string().required()).min(1),

})

export const DeleteUserBodySchema: Joi.ObjectSchema<deleteUserRequestInterface> = Joi.object({
    UserID: Joi.string().min(24).max(24).required(),

})

export const ChangePasswordSchema: Joi.ObjectSchema<changePasswordRequestInterface> = Joi.object({
    UserID: Joi.string().min(24).max(24).required(),
    NewPassword: Joi.string().required(),
    OldPassword: Joi.string().required()

})


export const ChangeDefaultPasswordSchema: Joi.ObjectSchema<changeDefaultPasswordRequestInterface> = Joi.object({
    UserID: Joi.string().min(24).max(24).required(),
    NewPassword: Joi.string().required(),

})

export const RequestCodeForNewPasswordSchema: Joi.ObjectSchema<RequestCodeForNewPasswordInterface> = Joi.object({
    Email: Joi.string().email().required(),


})

export const ChangePasswordWithCodeSchema: Joi.ObjectSchema<ChangePasswordWithCodeInterface> = Joi.object({
    Email: Joi.string().email().required(),
    NewPassword:Joi.string().required(),
    Code:Joi.number().required()


})