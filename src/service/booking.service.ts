
import mongoose from "mongoose";
import express, {  Request, Response } from "express";
import {  bookingModel } from "../model/index.model";
import { bookingSchemaValidate, userSchemaValidate } from "../validate/data.validate";
import bcrypt from 'bcrypt'
import { generatePDF } from "../utils/pdfGenerator";
import { transpoter } from "../utils/emailGenerator";

export class BookingServiceClass {
    // createBooking = async (req:Request, res:Response) =>{
    //     try {
    //         await bookingSchemaValidate.validate(req.body);
    //         const data = await bookingModel.create(req.body)
    //         return data;
    //     } catch (error:any) {
    //         throw new Error(error.message)
    //     }
    // }
    isSeatAvailable = async (busId: string, seatNo: number, date: Date) => {
        const existingBooking = await bookingModel.findOne({ busName: busId, seatNo, date });
        return !existingBooking;
      };

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

    deleteBookingById =  async (req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const data = await bookingModel.findByIdAndDelete(id);
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    deleteAllBooking =  async (req:Request, res:Response) =>{
        try {
            const data = await bookingModel.deleteMany();
            return data;
        } catch (error:any) {
            throw new Error(error.message)
        }
    }

    updateBookingById =   async (req:Request, res:Response) =>{
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

    getBookingPdf = async(req:Request, res:Response) =>{
        try {
            const {userId } = req.body;
            const data = await bookingModel.find({passenger: userId})
            if(!data){
                return res.status(404).json({message:'no booking to show'})
            }
            const doc = await generatePDF(data);
            return doc;
        } catch (error:any) {
            res.status(401).json({message: error.message})
        }
    }

    sendBookingEmail = async(req:Request, res:Response) =>{
        try {
            const {id} = req.params;
            const data = bookingModel.findById(id)
            const maillOptions = {
                from: process.env.EMAIL_USER,
                to: "madhavi@gmail.com",
                subject: 'result info',
                text:  `your booking is conformed ${data} `,
            }
            const info = await transpoter.sendMail(maillOptions)
            
        } catch (error:any) {
            console.error(`error sending email`, error)
        }
    }

}