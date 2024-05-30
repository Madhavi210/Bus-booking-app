
import mongoose, {Document, Schema, Model} from "mongoose";
import { number } from "yup";
import { IPassenger, IUser } from "./user.interface";

export interface IBooking extends Document {
    busId: Schema.Types.ObjectId,
    busName: string,
    passenger : Schema.Types.ObjectId | IPassenger,
    seatNo : number,
    date : Date,
    time: TimeRanges,
    isBooked: Boolean,
}
