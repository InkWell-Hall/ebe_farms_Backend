import { model, Schema } from "mongoose";
import  normalize  from "normalize-mongoose";


export const userModel = new Schema({
    userName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
});

userModel.plugin(normalize);
export const User = model('User',userModel);