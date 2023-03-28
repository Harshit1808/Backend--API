const express = require('express');
const userServices = require('../services/authServices');
const { verifyToken } = require("../auth/VerifyToken");
const router = express.Router();
const validator = require("./../validators/userValidator");
router.use(validator);
router.use(verifyToken);

router.post("/register", userServices.signUp)
router.post("/phone-check", userServices.phoneNumberCheck)
router.post("/otp-verify", userServices.otpVerify)
router.post("/resend-otp", userServices.otpResend)
router.post("/user-login", userServices.userLogin)

module.exports = router;