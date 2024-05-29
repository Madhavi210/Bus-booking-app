
import mongoose from "mongoose";
import express, {  Request, Response } from "express";
import {  bookingModel } from "../model/index.model";
import { bookingSchemaValidate, userSchemaValidate } from "../validate/data.validate";
import bcrypt from 'bcrypt'

export class BookingServiceClass {
    createBooking = async (req:Request, res:Response) =>{
        try {
            await bookingSchemaValidate.validate(req.body);
            const data = await bookingModel.create(req.body)
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    getBookingById = async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const data = await bookingModel.findById(id);
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    getAllBooking = async (req:Request, res:Response) =>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = Math.max(page-1, 0) * limit;

            const searchQuery:any = {};
            if(req.query.search) {
                const searchValue = req.query.search as string ;
                searchQuery.$or = [
                    {passenger: {$regex:searchValue, $options:'i'}},
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

            const data = await bookingModel.aggregate(pipeline).exec();
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    deleteUserById =  async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const data = await bookingModel.findByIdAndDelete(id);
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    deleteAllUser =  async (req:Request, res:Response) =>{
        try {
            const data = await bookingModel.deleteMany();
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    updateUserById =   async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const {passenger, busName, seatNo, date, time } = req.body;
            if(!passenger || !busName || !seatNo) {
                res.status(400).json('passenger , busname and seatno is required')
            }
            await userSchemaValidate.validate(req.body);
            const data = await bookingModel.findByIdAndUpdate(id, {passenger, busName, seatNo, date, time}, {new:true});
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

}