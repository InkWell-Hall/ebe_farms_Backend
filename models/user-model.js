import { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";

export const userModel = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String, // Changed to String to accommodate international phone number formats
        required: true,
    },
    otp: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});

userModel.plugin(normalize);
export const User = model("User", userModel);
