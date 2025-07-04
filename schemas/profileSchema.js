import Joi from "joi";

export const userJoiSchema = Joi.object({
  user: Joi.string().required(),
  image: Joi.array().items(Joi.string()).min(1).required(),
});
