
import mongoose from "mongoose";
import express, {  Request, Response } from "express";
import { busModel } from "../model/index.model";
import { busSchemaValidate, userSchemaValidate } from "../validate/data.validate";
import bcrypt from 'bcrypt'

export class BusServiceClass {
    createBus = async (req:Request, res:Response) =>{
        try {
            await busSchemaValidate.validate(req.body);
            const data = await busModel.create(req.body)
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    getBusById = async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const data = await busModel.findById(id);
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    getAllBus = async (req:Request, res:Response) =>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = Math.max(page-1, 0) * limit;

            const searchQuery:any = {};
            if(req.query.search) {
                const searchValue = req.query.search as string ;
                searchQuery.$or = [
                    {busNumber: {$regex:searchValue, $options:'i'}},
                    {busName: {$regex:searchValue, $options:'i'}},
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

            const data = await busModel.aggregate(pipeline).exec();
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    deleteBusById =  async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const data = await busModel.findByIdAndDelete(id);
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    deleteAllBus =  async (req:Request, res:Response) =>{
        try {
            const data = await busModel.deleteMany();
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    updateBusById =   async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const {busName, busNumber, numberOfSeat, description} = req.body;
            if(!busName || !busNumber || !numberOfSeat) {
                res.status(400).json('busname , busnumber, amd numberofseat is required')
            }
            await busSchemaValidate.validate(req.body);
            const data = await busModel.findByIdAndUpdate(id, {busName, busNumber ,numberOfSeat, description}, {new:true});
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

}