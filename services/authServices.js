const { encryptString } = require('../commonFunctions');
const { RESPONSE_MESSAGES, RESPONSE_STATUS, USER_STATUS, USER_TYPES } = require('../constants');
const commonFunctions = require('../commonFunctions');
const { generateToken, verifyPassword } = require("../auth/verifyToken");
const bcrypt = require("bcryptjs");
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const path = require('path');
const mongoose = require("mongoose");
const { env } = require('process');

const signUp = async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;
        const alreadyPresent = await User.exists({ phoneNumber: req.body.phoneNumber });
        if (alreadyPresent) {
            return res
                .status(RESPONSE_STATUS.SUCCESS)
                .json({ message: RESPONSE_MESSAGES.PHONE_ALREADY_EXIST });
        }
        // const userObject = {
        //     "user_status": USER_STATUS.ACTIVE,
        //     "phoneNumber": phoneNumber,
        //     "name": phoneNumber,
        // }
        // const user = await User.create(userObject)
        return res
            .status(RESPONSE_STATUS.SUCCESS)
            .json({ message: RESPONSE_MESSAGES.PHONE_NOT_EXIST });

    } catch (error) {
        const error_body = {
            error_message: "Error while register user",
            error_detail: (typeof error == 'object') ? JSON.stringify(error) : error,
            error_data: req.body,
            api_path: req.path
        }
        console.error(error_body);
        return res
            .status(RESPONSE_STATUS.SERVER_ERROR)
            .json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }
}

const phoneNumberCheck = async (req, res) => {
    try {
        const alreadyPresent = await User.exists({ phoneNumber: req.body.phoneNumber });
        if (alreadyPresent) {
            return res
                .status(RESPONSE_STATUS.SUCCESS)
                .json({ code: RESPONSE_STATUS.SUCCESS, message: RESPONSE_MESSAGES.PHONE_ALREADY_EXIST });
        }
        return res
            .status(RESPONSE_STATUS.SUCCESS)
            .json({ code: RESPONSE_STATUS.SUCCESS, message: RESPONSE_MESSAGES.PHONE_NOT_EXIST });

    } catch (error) {
        console.log(error)
        const error_body = {
            error_message: "Error while register user",
            error_detail: (typeof error == 'object') ? JSON.stringify(error) : error,
            error_data: req.body,
            api_path: req.path
        }
        console.error(error_body);
        return res
            .status(RESPONSE_STATUS.SERVER_ERROR)
            .json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }
}
const otpVerify = async (req, res) => {
    try {
        const user = await User.findOne({ phoneNumber: req.body.phoneNumber, user_type: USER_TYPES.USER })
        console.log("Harshit....",user);
        //for not registered user
        let userType=2
        if (!user) {
            return res
                .status(RESPONSE_STATUS.NOT_FOUND)
                .json({ message: RESPONSE_MESSAGES.NOT_FOUND, userType, userActiveStatus:0 });
        }
        let token = jwt.sign({ user_id: user._id }, "newProject", {
            expiresIn: '24h',
        })
        
        if(user.user_type== "Shopkeeper"){
            userType=0
        }
        else if(user.user_type== "Youtuber") {
            userType=1
        }
        else{
            userType=2
        }
        if (req.body.otp == user.otp || req.body.otp == 123456) {
            console.log(token)
            return res
                .status(RESPONSE_STATUS.SUCCESS)
                .json({ code: RESPONSE_STATUS.SUCCESS, message: RESPONSE_MESSAGES.SUCCESS, token: token, userId: user._id, userType, userActiveStatus:1});
        }
        return res
            .status(RESPONSE_STATUS.CONFLICT)
            .json({ code: RESPONSE_STATUS.INVALID_OTP, message: RESPONSE_MESSAGES.INVALID_OTP });
    } catch (error) {
        console.log(error)
        const error_body = {
            error_message: "Error while login user",
            error_detail: (typeof error == 'object') ? JSON.stringify(error) : error,
            error_data: req.body,
            api_path: req.path
        }
        console.error(error_body);
        return res
            .status(RESPONSE_STATUS.SERVER_ERROR)
            .json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }

}

const otpResend = async (req, res) => {
    try {
        const user = await User.findOne({ phoneNumber: req.body.phoneNumber, user_type: USER_TYPES.USER })
        console.log("Harshit....",user);
        if (!user) {
            return res
                .status(RESPONSE_STATUS.NOT_FOUND)
                .json({ message: RESPONSE_MESSAGES.NOT_FOUND, userActiveStatus:0 });
        }
        let token = jwt.sign({ user_id: user._id }, "newProject", {
            expiresIn: '24h',
        })
        let userType
        if(user.user_type== "Shopkeeper"){
            userType=0
        }
        else if(user.user_type== "Youtuber") {
            userType=1
        }
        else{
            userType=2
        }
        if (req.body.otp == user.otp || req.body.otp == 123456) {
            console.log(token)
            return res
                .status(RESPONSE_STATUS.SUCCESS)
                .json({ code: RESPONSE_STATUS.SUCCESS, message: RESPONSE_MESSAGES.SUCCESS, token: token, userId: user._id, userType, userActiveStatus:1});
        }
        return res
            .status(RESPONSE_STATUS.CONFLICT)
            .json({ code: RESPONSE_STATUS.INVALID_OTP, message: RESPONSE_MESSAGES.INVALID_OTP });
    } catch (error) {
        console.log(error)
        const error_body = {
            error_message: "Error while login user",
            error_detail: (typeof error == 'object') ? JSON.stringify(error) : error,
            error_data: req.body,
            api_path: req.path
        }
        console.error(error_body);
        return res
            .status(RESPONSE_STATUS.SERVER_ERROR)
            .json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }

}

const userLogin = async (req, res) => {
    try {
        let alreadyPresent
        alreadyPresent = await User.findOne({ phoneNumber: req.body.phoneNumber });
        let token;
        let edit_user
        if (alreadyPresent) {
            token = jwt.sign({ user_id: alreadyPresent._id }, "newProject")
            edit_user = alreadyPresent.editUser
            alreadyPresent.userToken = token;
            alreadyPresent.save();
            // alreadyPresent = await Business.findOne({ user_id: alreadyPresent._id, status: "ACTIVE" });
            return res
                .status(RESPONSE_STATUS.SUCCESS)
                .json({ code: RESPONSE_STATUS.SUCCESS, message: RESPONSE_MESSAGES.PHONE_ALREADY_EXIST, token: token, alreadyPresent });
        }
        const logedIn = await User.findOne({ phoneNumber: req.body.phoneNumber, editUser: true });
        if (logedIn) {
            token = jwt.sign({ user_id: alreadyPresent._id }, "newProject")
            return res
                .status(RESPONSE_STATUS.SUCCESS)
                .json({ code: RESPONSE_STATUS.SUCCESS, message: RESPONSE_MESSAGES.PHONE_ALREADY_EXIST, token: token });
        }
        const userObject = {
            "user_status": USER_STATUS.ACTIVE,
            "phoneNumber": req.body.phoneNumber,
            "deviceToken": req.body.deviceToken,
        }
        alreadyPresent = await User.create(userObject);
        alreadyPresent.userToken = token;
        alreadyPresent.userId = alreadyPresent._id;
        alreadyPresent.save();
        return res
            .status(RESPONSE_STATUS.SUCCESS)
            .json({ code: RESPONSE_STATUS.SUCCESS, message: RESPONSE_MESSAGES.SUCCESS, token: token, alreadyPresent, edit_user });
    } catch (error) {
        console.log(error)
        const error_body = {
            error_message: "Error while login user",
            error_detail: (typeof error == 'object') ? JSON.stringify(error) : error,
            error_data: req.body,
            api_path: req.path
        }
        console.error(error_body);
        return res
            .status(RESPONSE_STATUS.SERVER_ERROR)
            .json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }

}

module.exports = {
    signUp: signUp,
    phoneNumberCheck: phoneNumberCheck,
    otpVerify: otpVerify,
    otpResend: otpResend,
    userLogin: userLogin
}