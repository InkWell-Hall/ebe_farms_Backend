import Joi from "joi";

export const paymentJoiSchema = Joi.object({
    investmentId: Joi.string().required(),

    amount: Joi.number().min(0).required(),

    method: Joi.string()
        .valid("mobile money", "bank transfer", "card", "cash")
        .required(),
    date: Joi.date().default(() => new Date(), 'current date'),

    transactionId: Joi.string(),
});
