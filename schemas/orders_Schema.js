import Joi from 'joi';

export const orderSchema = Joi.object({
  cart: Joi.string().required(),
  user: Joi.string(),
  address: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  zipcode: Joi.string().required(),
  phone: Joi.string().required(),
  status: Joi.string().valid('order placed').default('order placed'),
  amount: Joi.number(),
  paymentMethod: Joi.string().valid('mobile_money', 'bank_transfer', 'card').required(),
  payment: Joi.boolean().default(false),
  date: Joi.date(),
});
