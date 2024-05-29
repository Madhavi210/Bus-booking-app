import { Request, Response, NextFunction } from "express";
import { userModel } from "../model/user.model";
import { IUser } from "../interface/user.interface";
import { apiError } from "../helper/apiError";
import bcrypt from 'bcrypt';
import { error } from "console";
import jwt from 'jsonwebtoken'
import { apiResponse } from "../helper/apiResponse";
import session from "express-session";
import { configDotenv } from "dotenv";



interface AuthenticatedRequest extends Request {
    user?: IUser
}

declare module 'express-session' {
    interface SessionData {
        user: {
            id: String;
            userName: String;
            email:  String;
            role:String;
        }
    }
}

export class AuthenticateMiddleware {
    userExist = async (req:Request , res:Response, next:NextFunction) =>{
        try {
            const {userName, email, password} = req.body;
            const user = await userModel.findOne(
               { $or:[{email},{userName}]}
            )

            if(!user){
                return res.status(404).json("username is not found" )
            }
            const isPassword = await bcrypt.compare(password, user.password.toString()) 
            if(!isPassword){
                const errResponse = new apiError(401, "Invalid credentials", [ "Invalid credentials",]);
                return res.status(errResponse.statusCode).json(errResponse);
            } 
            (req as AuthenticatedRequest).user = user;
            next();
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    loginUser = async (req:Request , res:Response, next:NextFunction) =>{
        try {
            const {userName, email, password} = req.body;
            const user = await userModel.findOne(
               { $or:[{email},{userName}]}
            )

            if(!user){
                return res.status(404).json("username is not found" )
            }
            const isPassword = await bcrypt.compare(password, user.password.toString()) 
            if(!isPassword){
                const errResponse = new apiError(401, "Invalid credentials", [ "Invalid credentials",]);
                return res.status(errResponse.statusCode).json(errResponse);
            } 

            const accessToken = jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_SECRET!, {expiresIn:'1h' })
            const refreshToken = jwt.sign({id: user.id, role: user.role}, process.env.REFRESH_SECRET!, {expiresIn:'7d' })

            const updatedUser = await userModel.findByIdAndUpdate(user._id, {$set:{accessToken, refreshToken}}, {new:true})

            req.session.user = {
                id: user.id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            };

            const response = new apiResponse(200, updatedUser, 'user is exist') 

            res.cookie('refreshToken', refreshToken, {httpOnly:true})
            res.header("auth-tokrn", accessToken).status(response.statusCode).json(response)
        }
        catch(error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    isLoggedIn = async (req:Request, res:Response , next:NextFunction) =>{
        try {
            const token = req.header('Authorization')?.replace('Bearer', "")
            if(!token){
                const errorResponse = new apiError(401, 'authorization token is required', ['authorization token is required'])
                return res.status(errorResponse.statusCode).json(errorResponse);
            }

            const decoded:any = jwt.verify(token, process.env.ACCESS_SECRET!)
            const user = await userModel.findById(decoded.id)

            if(!user || !['user', 'admin'].includes(user.role)){
                const errResponse = new apiError(403, "Forbidden", ["Forbidden"]);
                return res.status(errResponse.statusCode).json(errResponse);
            }

            (req as AuthenticatedRequest).user = user;
            next();
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    refreshToken = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.body.refreshToken || req.headers['x-refresh-token']
            if(!refreshToken) {
                return res.status(401).json({message:'refresh token is required'})
            }
            const decoded:any = jwt.verify(refreshToken, process.env.REFRESH_SECRET!)
            const user = await userModel.findById(decoded.id)
            if(!user){
                return res.status(404).json({message: 'user not found'})
            }
            const accessToken = jwt.sign({id:user.id, role:user.role} , process.env.ACCESS_SECRET!, {expiresIn:'7h'})
            return res.status(200).json({accessToken})
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    logoutUser = async(req:Request, res:Response) =>{
        try {
            const userId = req.session.user?.id
            if(!userId){
                return res.status(400).json({messgaae: 'no user logged in'})
            }
            await userModel.findByIdAndUpdate(userId, {$unset:{accessToken:"", refreshToken:"" }})
            req.session.destroy((error) =>{
                if(error){
                    return res.status(500).json({message:'failed to logout'})
                }
                res.clearCookie('connect.sid')
                res.clearCookie('refreshToken')
                res.status(200).json({message: 'user logged out successfully'})
            })
        } catch (error:any) {
            const errorResponse = new apiError(500, 'internal server error', [error.message])
            res.status(errorResponse.statusCode).json(errorResponse)
        }
    }

    
}