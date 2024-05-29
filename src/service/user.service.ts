
import mongoose from "mongoose";
import express, {  Request, Response } from "express";
import { userModel,bookingModel } from "../model/index.model";
import { userSchemaValidate } from "../validate/data.validate";
import bcrypt from 'bcrypt'

export class UserServiceClass {
    createUser = async (req:Request, res:Response) =>{
        try {
            await userSchemaValidate.validate(req.body);
            const {password, ...otherDetail} = req.body;
            const hashedPassword = bcrypt.hash(password, 10)
            const data = await userModel.create({password:hashedPassword, ...otherDetail})
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    getUserById = async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const data = await userModel.findById(id);
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    getAllUser = async (req:Request, res:Response) =>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = Math.max(page-1, 0) * limit;

            const searchQuery:any = {};
            if(req.query.search) {
                const searchValue = req.query.search as string ;
                searchQuery.$or = [
                    {userName: {$regex:searchValue, $options:'i'}},
                    {email: {$regex:searchValue, $options:'i'}},
                ]
            }

            const searching = {...searchQuery}
            const sort = req.query.sort  ? JSON.parse(req.query.sort as string) : {createdAt: -1}
            const pipeline= [
                {$match: searching},
                {$skip: skip},
                {$limit: limit},
                {$sort: sort},
            ]

            const data = await userModel.aggregate(pipeline).exec();
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    deleteUserById =  async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const user = await userModel.findById(id);
            if(!user){
                console.log("user not found");
                return;
            }
            await bookingModel.deleteMany({passenger: id})
            const data = await userModel.findByIdAndDelete(id);
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    deleteAllUser =  async (req:Request, res:Response) =>{
        try {
            const data = await userModel.deleteMany();
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    updateUserById =   async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const {userName, email, password, age, address, role , mobileNo, } = req.body;
            if(!userName || !email || !password) {
                res.status(400).json('username, email, password is required')
            }
            await userSchemaValidate.validate(req.body);
            const data = await userModel.findByIdAndUpdate(id, {userName, email, password, age, address, mobileNo, role}, {new:true});
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

}