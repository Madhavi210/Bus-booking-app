import mongoose from "mongoose";
import express, {  Request, Response } from "express";
import { userModel,bookingModel } from "../model/index.model";
import { UserServiceClass } from "../service/user.service";
import { apiError } from "../helper/apiError";
import { apiResponse } from "../helper/apiResponse";

const userService = new UserServiceClass();

export class userControllerClass {
    createUser = async (req:Request, res:Response) =>{
        try {
            const data = await userService.createUser(req, res)
            const response = new apiResponse(200, data, 'user created successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    getAllUser = async (req:Request, res:Response) =>{
        try {
            const data = await userService.getAllUser(req, res);
            const totalRecord = await userModel.countDocuments();
            const totalPage = Math.ceil(totalRecord / (parseInt(req.query.limit as string) || 10));
            const response = new apiResponse(200, {totalPage, totalRecord, data}, 'users retrieved successfully')
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    getUserById = async (req:Request, res:Response) =>{
        try {
            const data = await userService.getUserById(req, res)
            const response = new apiResponse(200, data, 'user retrieved by id successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    deleteAllUser = async (req:Request, res:Response) =>{
        try {
            const data = await userService.deleteAllUser(req, res)
            const response = new apiResponse(200, data, 'user deleted successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }
    
    deleteUserById = async (req:Request, res:Response) =>{
        try {
            const data = await userService.deleteUserById(req, res)
            const response = new apiResponse(200, data, 'user deleted by id successfully');
            res.status(response.statusCode).json(response);
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

}