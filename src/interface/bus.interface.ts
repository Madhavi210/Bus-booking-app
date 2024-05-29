
import mongoose, {Document, Schema, Model} from "mongoose";

export interface IBus extends Document {
    busName: string,
    busNumber: string,
    numberOfSeat : number,
    description: string,
}

