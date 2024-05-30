import mongoose from "mongoose";
import express, {  Request, Response } from "express";
import { bookingModel } from "../model/index.model";
import { BookingServiceClass } from "../service/index.service";
import { apiError } from "../helper/apiError";
import { apiResponse } from "../helper/apiResponse";
import { bookingSchemaValidate } from "../validate/data.validate";
import { IBooking } from "../interface/booking.interface";

const bookingService = new BookingServiceClass();
export class BookingControllerClass {
    // createBooking = async (req:Request, res:Response) =>{
    //     try {
    //         const data = await bookingService.createBooking(req, res)
    //         const response = new apiResponse(200, data, 'booking created successfully');
    //         res.status(response.statusCode).json(response);
    //     } catch (error:any) {
    //         const errorResponse = new apiError(500, 'internal server error', [error.message])
    //         res.status(errorResponse.statusCode).json(errorResponse)
    //     }
    // }

    bookSeat = async (req:Request, res:Response) =>{
        try {
            const data = await bookingService.bookSeat(req, res);
            const response = new apiResponse(200,  data, 'booking  successfully')
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse);
        }
    }

    getSeatsStatus = async (req:Request, res:Response) =>{
        try {
            const data = await bookingService.getSeatsStatus(req, res);
            const response = new apiResponse(200,  data, 'available seat retrieved successfully')
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse);
        }
    }


    getAllBooking = async (req:Request, res:Response) =>{
        try {
            const data = await bookingService.getAllBooking(req, res);
            const totalRecord = await bookingModel.countDocuments();
            const totalPage = Math.ceil(totalRecord / (parseInt(req.query.limit as string) || 10));
            const response = new apiResponse(200, {totalPage, totalRecord, data}, 'booking retrieved successfully')
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    getBookingById = async (req:Request, res:Response) =>{
        try {
            const data = await bookingService.getBookingById(req, res)
            const response = new apiResponse(200, data, 'booking retrieved by id successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    deleteAllBooking = async (req:Request, res:Response) =>{
        try {
            const data = await bookingService.deleteAllBooking(req, res)
            const response = new apiResponse(200, data, 'booking deleted successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }
    
    deleteBookingById = async (req:Request, res:Response) =>{
        try {
            const data = await bookingService.deleteBookingById(req, res)
            const response = new apiResponse(200, data, 'booking deleted by id successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    downloadBookingPDF = async(req:Request, res:Response) =>{
        try {
            const doc = await bookingService.getBookingPdf(req, res)
            if(doc){
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', "attachment; filename='booking_detail.pdf'")
                doc.pipe(res);
                doc.end();
            } else {
                const errResponse = new apiError(500, "Internal Server Error", [ "error generating pdf",]);
                res.status(errResponse.statusCode).json(errResponse);
            }
        } catch (error:any) {
            const errResponse = new apiError(500, "Internal Server Error", [error.message, ]);
            res.status(errResponse.statusCode).json(errResponse);
        }
    }

    notifyEmail = async(req:Request, res:Response) =>{
        const {email, password} = req.body;
        try {
            await bookingService.sendBookingEmail(email,password)
        } catch (error:any) {
            res.status(500).send("error in sending mail")
        }
    }

}