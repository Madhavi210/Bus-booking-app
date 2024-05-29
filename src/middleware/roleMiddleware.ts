import { NextFunction,Request, Response } from "express";
import { apiError } from "../helper/apiError";
import { IUser } from "../interface/user.interface";

interface AuthenticatedRequest extends Request{
    user?:IUser
}
export class RoleMiddleware {
    isAdmin = async(req:Request, res:Response, next:NextFunction) =>{
        try {
            const user = (req as AuthenticatedRequest ).user;
            if(user?.role !== 'admin'){
                const errorResponse = new apiError(403, 'Forbidden, principal or teacher required', ['Forbidden, principal or teacher required']);
                return res.status(errorResponse.statusCode).json(errorResponse);
            } 
            next();
        } catch (error:any) {
            const errorResponse = new apiError(500, 'Internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }
}