import Joi from "joi";

export const paymentSchema = Joi.object({
  investmentId: Joi.string(),
  orderId: Joi.string(),

  amount: Joi.number().min(0),
  method: Joi.string().valid("mobile_money", "bank_transfer", "card").required(),
  date: Joi.date().default(() => new Date()),
  transactionId: Joi.string(),
});


