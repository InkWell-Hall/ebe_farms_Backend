import Joi from "joi";

export const paymentSchema = Joi.object({
    investmentId: Joi.string().required(),

    amount: Joi.number().min(0).required(),

    method: Joi.string()
        .valid("mobile_money", "bank transfer", "card")
        .required(),
    date: Joi.date().default(() => new Date()),

    transactionId: Joi.string(),
});

