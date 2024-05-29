
import mongoose, {Document, Schema, Model} from "mongoose";

export interface IUser extends Document {
    userName : String,
    email: string,
    password: string,
    age: number,
    role: 'user' | 'admin',
    address: string,
    mobileNo: string,
    refreshToken: string,
    accessToken: string,
}

export interface IPassenger extends IUser{}