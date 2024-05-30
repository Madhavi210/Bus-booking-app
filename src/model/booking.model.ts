
import mongoose,{Schema, Model} from "mongoose";
import { IBooking } from "../interface/booking.interface";

const bookingSchema =  new Schema<IBooking>({
    busId:{
        type: Schema.Types.ObjectId,
        ref: 'busModel',
        required: [true, "bus id is required"],
    },
    busName:{
        type: String,
        trim: true,
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
    },
    isBooked:{
        type: Boolean,
        require: true,
    },
},{timestamps:true})

export const bookingModel: Model<IBooking> = mongoose.model('bookingModel', bookingSchema)

