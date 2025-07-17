import Joi from "joi";

export const investorSchema = Joi.object({
  address: Joi.string().required(),
  accountNumber: Joi.string().required(),
  signature: Joi.string().required()
});
