import express, {Request,Response  } from "express";
import { BookingControllerClass} from "../controller/index.controller";
import {AuthenticateMiddleware} from '../middleware/authMiddleware';

const router = express.Router();
const bookingController = new BookingControllerClass();
const authMiddleware = new AuthenticateMiddleware();


router.get('/getbooking', authMiddleware.isLoggedIn, bookingController.getAllBooking)

router.get("/:id",authMiddleware.isLoggedIn, bookingController.getBookingById)

router.post('/post',authMiddleware.isLoggedIn, bookingController.addBooking)

router.delete('/deleteAll', authMiddleware.isLoggedIn, bookingController.deleteAllBooking)

router.delete(':id',authMiddleware.isLoggedIn, bookingController.deleteBookingById)

export default router;
