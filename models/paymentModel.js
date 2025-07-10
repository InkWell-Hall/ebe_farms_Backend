import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'

export const paymentModel = new Schema({
    investmentId: {
        type: Schema.Types.ObjectId,
        ref: "Investment",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    method: {
        type: String,
        enum: ["mobile_money", "bank_transfer", "card"],
        required: true,
    },
    status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
    },
    date: {
        type: Date,
        default: Date.now,
    },
    transactionId: String,
},{timestamps: true});

paymentModel.plugin(normalize);
export const Payment = model('Payment', paymentModel)