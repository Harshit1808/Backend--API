const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("./../models/user");

const {
    RESPONSE_STATUS,
    RESPONSE_MESSAGES
} = require("../constants");

const apisToBeByPassed = [
    "/register",
    "/phone-check",
    "/user-login",
    "/otp-verify",
    "/otp-resend"
];

function verifyToken(req, res, next) {
    try {
        if (apisToBeByPassed.indexOf(req.path) !== -1)
            return next();
        // if (headerTokenApis.includes(req.path))
        //     token = req.query.token;
        else
            token = req.headers["authorization"];
        if (!token) {
            return res
                .status(RESPONSE_STATUS.UNAUTHORIZED)
                .json({ message: RESPONSE_MESSAGES.TOKEN_NOT_FOUND });
        }
        token = token.split(" ");
        token = token.length > 1 ? token[1] : token[0];
        jwt.verify(token, "newProject", (err, decoded) => {
            if (err) {
                return res
                    .status(RESPONSE_STATUS.UNAUTHORIZED)
                    .json({ message: RESPONSE_MESSAGES.TOKEN_SESSION })
            }
            req.user_id = decoded.user_id
            req.email = decoded.email
            req.profile_pic = decoded.profile_pic || ''
            next();
        });
    } catch (error) {
        console.error("verify token function :", error);
        return res
            .status(RESPONSE_STATUS.SERVER_ERROR)
            .json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }
}

function generateToken(params) {
    let response = {};
    try {
        let user_id = params.user_id;
        let email = params.email || params.request.email;
        let profile_pic = params.profile_pic || '';

        let token = jwt.sign({ email: email, user_id, profile_pic }, "newProject", {
            expiresIn: '24h',
        }); // expires in 24 hours
        return (response.token = token);
    } catch (error) {
        console.error("Generating Token", "Error Occurred !!!", error);
        return (response.error = error);
    }
}

function verifyPassword({ email, password }) {
    return new Promise(async (resolve, reject) => {
        let askedUser = await User.findOne({ email: email }, { password: 1, profile_pic: 1 });
        if (!askedUser) {
            return reject({
                code: RESPONSE_STATUS.NOT_FOUND,
                message: RESPONSE_MESSAGES.NOT_FOUND,
            });
        }
        let password_verify = bcrypt.compareSync(password, askedUser.password);
        if (!password_verify) {
            return reject({
                code: RESPONSE_STATUS.UNAUTHORIZED,
                message: RESPONSE_MESSAGES.INVALID_CRED,
            });
        }


        return resolve({ status: RESPONSE_STATUS.SUCCESS, user_id: askedUser._id, profile_pic: askedUser.profile_pic });
    });
}

exports.verifyToken = verifyToken;
exports.generateToken = generateToken;
exports.verifyPassword = verifyPassword;

