

import mongoose from "mongoose";
import express, {  Request, Response } from "express";
import { busModel } from "../model/index.model";
import { BusServiceClass } from "../service/index.service";
import { apiError } from "../helper/apiError";
import { apiResponse } from "../helper/apiResponse";

const busService = new BusServiceClass();

export class BusControllerClass {
    createBus = async (req:Request, res:Response) =>{
        try {
            const data = await busService.createBus(req, res)
            const response = new apiResponse(200, data, 'bus added successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    getAllBus = async (req:Request, res:Response) =>{
        try {
            const data = await busService.getAllBus(req, res);
            const totalRecord = await busModel.countDocuments();
            const totalPage = Math.ceil(totalRecord / (parseInt(req.query.limit as string) || 10));
            const response = new apiResponse(200, {totalPage, totalRecord, data}, 'bus retrieved successfully')
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    getBusById = async (req:Request, res:Response) =>{
        try {
            const data = await busService.getBusById(req, res)
            const response = new apiResponse(200, data, 'bus retrieved by id successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    deleteAllBus = async (req:Request, res:Response) =>{
        try {
            const data = await busService.deleteAllBus(req, res)
            const response = new apiResponse(200, data, 'bus deleted successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }
    
    deleteBusById = async (req:Request, res:Response) =>{
        try {
            const data = await busService.deleteBusById(req, res)
            const response = new apiResponse(200, data, 'bus deleted by id successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

}