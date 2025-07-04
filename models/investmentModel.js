import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'

export const investmentModel = new Schema({
  investor: {
    type: Schema.Types.ObjectId,
    ref: "Investor",
    required: true,
  },
  farmProject: {
    type: Schema.Types.ObjectId,
    ref: "FarmProject",
    required: true,
  },
  amountInvested: {
    type: Number,
    required: true,
  },
  dateOfInvestment: {
    type: Date,
    default: Date.now,
  },
  expectedROI: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "completed"],
    default: "pending",
  },
});

investmentModel.plugin(normalize);
export const Investment = model('Investment', investmentModel)