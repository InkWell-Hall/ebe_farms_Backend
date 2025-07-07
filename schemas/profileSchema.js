import Joi from "joi";

export const profileSchema = Joi.object({
  images: Joi.array().items(Joi.string()).min(1).required()
});
