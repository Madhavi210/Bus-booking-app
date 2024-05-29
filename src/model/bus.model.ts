
import mongoose, {Schema, Model, mongo} from "mongoose";
import { IBus } from "../interface/bus.interface";

const busSchema = new Schema<IBus> ({
        busName: {
            type: String,
            required:true,
            trim: true,
        },
        busNumber:{
            type: String,
            required:true,
            trim: true,
        },
        numberOfSeat:{
            type: Number,
            required:true,
            trim: true,
        },
        description:{
            type: String,
            required:true,
        }
},{timestamps:true})

export const busModel :Model<IBus>= mongoose.model("busModel", busSchema) 