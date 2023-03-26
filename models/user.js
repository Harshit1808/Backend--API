const mongoose = require("mongoose");
const { USER_TYPES } = require("./../constants")
const { encryptString } = require("../commonFunctions")
const mongoosePaginate = require('mongoose-paginate');
const User = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User"
    },
    phoneNumber: { type: String },
    password: { type: String },
    name: { type: String },
    email: { type: String, default: "" },
    password: { type: String },
    userToken: {
        type: String
    },
    user_status: {
        type: String
    },
    user_type: {
        type: String,
        default: USER_TYPES.USER
    },
}, {
    minimize: false,
    timestamps: true,
});
User.plugin(mongoosePaginate);
mongoose.model("User", User);
module.exports = mongoose.model("User");


