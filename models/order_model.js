import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose';

export const orderModel = new Schema({
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'order placed',
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["mobile_money", "bank_transfer", "card"],
  },
  payment: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

orderModel.plugin(normalize);
export const Order = model('Order', orderModel);
