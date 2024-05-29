
import mongoose,{Schema, Model} from "mongoose";
import { IBooking } from "../interface/booking.interface";

const bookingSchema =  new Schema<IBooking>({
    busName:{
        type: Schema.Types.ObjectId,
        ref: 'busModel',
        required: [true, "bus name is required"],
    },
    passenger : {
        type: Schema.Types.ObjectId,
        ref: 'userModel',
        required: true,
    },
    seatNo:{
        type: Number,
        required:true,
        trim: true,
    },
    date:{
        type: Date,
        required:true,
        trim: true,
    },
    time:{
        type: TimeRanges,
        required:true,
        trim: true,
    }
},{timestamps:true})

export const bookingModel: Model<IBooking> = mongoose.model('bookingModel', bookingSchema)

