import express, {Request,Response  } from "express";
import { BusControllerClass} from "../controller/index.controller";
import {AuthenticateMiddleware} from '../middleware/authMiddleware';
import {RoleMiddleware} from '../middleware/roleMiddleware';

const router = express.Router();
const busController = new BusControllerClass();
const roleMiddleware = new RoleMiddleware();
const authMiddleware = new AuthenticateMiddleware();

router.get('/getUser',authMiddleware.isLoggedIn, busController.getAllBus)

router.get("/:id",authMiddleware.isLoggedIn, busController.getBusById)

router.post('/post',authMiddleware.isLoggedIn, roleMiddleware.isAdmin , busController.createBus)

router.delete('/deleteAll', authMiddleware.isLoggedIn, roleMiddleware.isAdmin , busController.deleteAllBus)

router.delete(':id', authMiddleware.isLoggedIn, roleMiddleware.isAdmin ,busController.deleteBusById)

export default router;
