import { HydratedDocument } from "mongoose";



export enum RolesEnum {
    USER = 'user',
    ADMIN = 'admin'
}
export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female'
}
export enum ProviderEnum {
    GOOGLE = 'google',
    SYSTEM = 'system'
}
export interface IOtp {
    otp: string;
    expiredAt: Date
}


export interface IUser {
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
    phone: string
    role: RolesEnum
    gender: GenderEnum
    provider: ProviderEnum
    age: number
    credantialsChangedAt: Date
    emailOtp: IOtp
    passwordOtp: IOtp,
    IsConfirmed: boolean,
    picture: string
}

export type IHydratedUser=HydratedDocument<IUser>