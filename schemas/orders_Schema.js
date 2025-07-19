
import Joi from 'joi';

export const orderSchema = Joi.object({
    cart: Joi.string().required(),

    user: Joi.string().required(),

    address: Joi.string().required(),

    status: Joi.string().valid('order placed').default('order placed'),
    amount: Joi.number().default(0).required(),
    paymentMethod: Joi.string()
        .valid('cash on delivery', 'online payment', 'stripe')
        .required(),

    payment: Joi.boolean().default(false),

    date: Joi.number().required()
});
