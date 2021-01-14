import { Document } from "mongoose";

export interface Permissions {
    PermissionID: string,
}

export interface UserModelInterface extends Document {
    Username: string,
    Email: string,
    PhoneNo: string,
    Name: string,
    Password: string,
    DepartmentID: number,
    DepartmentName: string,
    GeneralCharges: number,
    Qualification: string,
    UserTypeID: number,
    UserType: string,
    IsDefaultPasswordChanged: boolean,
    IsAccountVerified: boolean,
    Permissions: Array<string>
}

export interface UserSaveRequestInterface {
    Username: string,
    Email: string,
    PhoneNo: string,
    Name: string,
    DepartmentID: number,
    GeneralCharges: number,
    Qualification: string,
    UserTypeID: number,
    PermissionsArray: Array<string>,
}


export interface loginRequestInterface {
    Email: string,
    Password: string,
}

export interface UserUpdateRequestInterface {
    UserID: string,
    Username?: string,
    Email?: string,
    PhoneNo?: string,
    Name?: string,
    DepartmentID?: number,
    GeneralCharges?: number,
    Qualification?: string,
    UserTypeID?: number,
    PermissionsArray?: Array<string>,

}


export interface deleteUserRequestInterface {
    UserID: string,

}


export interface getAllUsersInterface {
    Page: string,
    Size: string,
    Name: string,
    Type: string,
    Department: string,
    Email: string,
    PhoneNo: string,
    GeneralCharges: string,
}


export interface changePasswordRequestInterface {
    UserID: string,
    OldPassword: string,
    NewPassword: string,
}


export interface changeDefaultPasswordRequestInterface {
    UserID: string,
    NewPassword: string,
}

export interface RequestCodeForNewPasswordInterface {
    Email: string,
}

export interface ChangePasswordWithCodeInterface {
    Email: string,
    NewPassword: string,
    Code: string,
}