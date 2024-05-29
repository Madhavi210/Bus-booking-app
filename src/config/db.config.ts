
import { error } from 'console';
import mongoose ,{ Schema, Model ,Document}from 'mongoose'
import * as dotenv  from 'dotenv';
dotenv.config();

const url: string | undefined = process.env.MONGO_URI;
if(!url){
    throw new Error("please provide mongodb path in .env file")
} 
export const connectDB = async() =>{
     mongoose.connect(url)
    .then(() =>{
        console.log("database connected successfully"); 
    })
    .catch((error) =>{
        console.log("failed to connect db", error);
    })
}  