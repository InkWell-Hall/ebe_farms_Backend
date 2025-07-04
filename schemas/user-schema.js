import Joi from "joi";


export const userSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
})

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().strip(), //.strip() removes confirm Password from output after validation
})