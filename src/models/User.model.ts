import { UserTypesEnum } from '../Constants/Constants';
import { Schema, model, Document } from 'mongoose';
import { UserModelInterface } from '../interfaces/index';




//creating Scheme;
const UserSchema: Schema = new Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    PhoneNo: {
        type: String,
        unique: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    DepartmentID: {
        type: Number,
    },
    DepartmentName: {
        type: String,
    },
    GeneralCharges: {
        type: Number,
    },
    Qualification: {
        type: String,
    },
    UserTypeID: {
        type: Number,
        required: true,
        default: UserTypesEnum.Doctor
    },
    UserType: {
        type: String,
        required: true,
        default: "Doctor"
    },
    IsDefaultPasswordChanged: {
        type: Boolean,
        required: true,
        default: false,
    },
    IsAccountVerified: {
        type: Boolean,
        required: true,
        default: true,
    },
    Permissions: {
        type: [{
            type: String,
        }],
        required: true,
    }

}, { timestamps: true, });

export const UserModel = model<UserModelInterface>("Users", UserSchema);

