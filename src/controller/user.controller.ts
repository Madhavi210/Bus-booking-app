import mongoose from "mongoose";
import express, {  Request, Response } from "express";
import { userModel,bookingModel } from "../model/index.model";
import { UserServiceClass } from "../service/user.service";

const userService = new UserServiceClass();

export class userControllerClass {
    createUser = async (req:Request, res:Response) =>{
        try {
            
        } catch (error:any) {
            
        }
    }
}