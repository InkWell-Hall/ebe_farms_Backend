import Joi from 'joi';

export const investmentSchema = Joi.object({
    investor: Joi.string().required(),
    farmProject: Joi.string().required(),
    amountInvested: Joi.number().min(0).required(),

    dateOfInvestment: Joi.date().default(() => new Date(), 'current date'),

    expectedROI: Joi.number().min(0),

    paymentStatus: Joi.string()
        .valid("pending", "paid", "completed")
        .default("pending"),
})