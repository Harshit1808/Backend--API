const { Types } = require("mongoose");
const validator = require("./validator");

const userApiPathModels = {
    "/register": {
        phoneNumber: { type: String }
    },
    "/phone-check": {

    },
    "/user-login": {},
    "/otp-verify": {
        phoneNumber: { type: String },
        otp: { type: String }
    },
    "/resend-otp": {
        phoneNumber: { type: String },
        otp: { type: String }
    }
};

module.exports = function handler(req, res, next) {
    if (!userApiPathModels[req.path]) {
        console.error(req.path, ": Missing Parameters");
        return res.status(400).json({ message: "No validator for this path" });
    }

    validator(req, res, next, userApiPathModels[req.path]);
};