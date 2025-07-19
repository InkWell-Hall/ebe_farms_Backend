
import Joi from 'joi';

export const cartSchema = Joi.object({
    items: Joi.array().items(Joi.object({
        advert: Joi.string().required().trim(),
        quantity: Joi.number().integer().min(1).required(),
    })).required(),
    totalAmount: Joi.number(),
    dateAdded: Joi.number(),
});