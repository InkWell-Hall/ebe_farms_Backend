import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'

export const investorModel = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: String,
  investments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Investment",
    },
  ],
  accountNumber: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

investorModel.plugin(normalize);
export const Investor = model('Investor', investorModel)