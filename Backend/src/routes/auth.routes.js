import express from 'express';
import {
    sendOtp,
    authUser,
    getAvatar,
    logoutUser
} from '../controllers/auth.controller.js';
import verifyJWT from "../middlewares/auth.middleware.js";      

const router = express.Router();

/*
    * @api http://localhost:3000/api/v1/auth/send-otp
    * @method POST
    * @accept phoneNumber in body
    * @return otp to user phone number
*/
router.post('/send-otp', sendOtp);      

/*
    * @api http://localhost:3000/api/v1/auth/authintication
    * @method POST
    * @accept phoneNumber and otp in body
    * @return user data and token
*/
router.post('/authintication', authUser);

/*
    * @api http://localhost:3000/api/v1/auth/avatar
    * @method POST
    * @accept avatar in body String
    * @return user avatar
*/
router.post('/avatar', verifyJWT , getAvatar);

router.post('/logout', verifyJWT , logoutUser);

export default router;
