
import mongoose, {Document, Schema, Model, mongo} from "mongoose";
import { IUser } from "../interface/user.interface";
import { number } from "yup";
import { userRole } from "../enum/user.enum";

const userSchema = new Schema<IUser>({
    userName: {
        type: String,
        required:true,
        trim: true,
        unique: true,
    },
    email:{
        type: String,
        required:true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required:true,
        trim: true,
    },
    age:{
        type: Number,
        required:true,
    },
    role:{
        type: String,
        enum : Object.values(userRole),
        required:true,
        default: userRole.USER,
        trim: true,
    },
    address:{
        type: String,
        required:true,
        trim: true,
    },
    mobileNo:{
        type: String,
        required:true,
        trim: true,
    }
},{timestamps:true});

export const userModel:Model<IUser> = mongoose.model('userModel', userSchema)
export const passengerModel:Model<IUser> = mongoose.model('userModel', userSchema)

