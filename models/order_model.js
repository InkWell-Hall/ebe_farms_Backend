
import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose';

export const orderModel = new Schema({
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,

    },
    status: {
        type: String,
        required: true,
        default: 'order placed'
    },
    amount: {
        type: Number,
        default: 0,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["mobile_money", "bank_transfer", "card"]
    },
    payment: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        required: true
    }
    
},{timestamps: true});

orderModel.plugin(normalize)
export const Order = model('Order', orderModel);