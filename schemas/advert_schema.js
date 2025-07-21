import Joi from 'joi';

export const advertSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  images: Joi.array().items(Joi.string()).min(1).required(),
  category: Joi.string().required(),
  unit: Joi.string().required(),
  farmer: Joi.string().required(),
  location: Joi.string().required(),
  rating: Joi.string().required(),
  reviews: Joi.string().required(),
  freshness: Joi.string().required(),
  quantity: Joi.string().required(),
  bestseller: Joi.boolean(),
  date: Joi.date().required()
});
