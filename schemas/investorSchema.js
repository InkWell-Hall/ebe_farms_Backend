import Joi from "joi";

export const investorSchema = Joi.object({
  address: Joi.string(),
});
