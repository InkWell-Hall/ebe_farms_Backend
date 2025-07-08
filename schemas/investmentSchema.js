import Joi from 'joi';

export const investmentSchema = Joi.object({
    amountInvested: Joi.number().min(0).required(),

    dateOfInvestment: Joi.date().default(() => new Date()),

    expectedROI: Joi.number().min(0),

    paymentStatus: Joi.string()
        .valid("pending", "paid", "completed")
        .default("pending"),
})