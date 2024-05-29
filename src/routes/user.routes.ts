import express, {Request,Response  } from "express";
import { userControllerClass} from "../controller/index.controller";
import {AuthenticateMiddleware} from '../middleware/authMiddleware';

const router = express.Router();
const userController = new userControllerClass();

router.get('/getUser', userController.getAllUser)

router.get("/:id", userController.getUserById)

router.post('/post', userController.createUser)

router.delete('/deleteAll', userController.deleteAllUser)

router.delete(':id', userController.deleteUserById)

export default router;
