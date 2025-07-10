import Joi from "joi";

export const farmProjectSchema = Joi.object({
    projectName: Joi.string().required(),

    location: Joi.string().required(),
    description: Joi.string().required(),

    estimatedROI: Joi.number().min(0).required(),
    durationInMonths: Joi.number().min(0).required(),

    totalRequiredFunding: Joi.number().min(0).required(),
    receivedFunding: Joi.number().min(0).default(0).required(),
    images: Joi.array().items(Joi.string()).min(1).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),

    isActive: Joi.boolean().default(true),
    investors: Joi.array().items(Joi.string()).default([]),
});
