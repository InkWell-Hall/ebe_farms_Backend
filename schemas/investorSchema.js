import Joi from "joi";

export const investorSchema = Joi.object({
  user: Joi.string().required(),
  address: Joi.string(),

  investments: Joi.array().items(Joi.string()).default([]),

  createdAt: Joi.date().default(() => new Date(), 'current date'),
});
