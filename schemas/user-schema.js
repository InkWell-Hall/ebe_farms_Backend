import Joi from "joi";


export const userSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
});

export const adminSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    adminCode:  Joi.string().required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().strip(), //.strip() removes confirm Password from output after validation
});

export const adminloginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().strip(), //.strip() removes confirm Password from output after validation
    adminCode: Joi.string().required(),
});

export const passwordResetSchema = Joi.object({
    newPassword: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'New password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm password is required',
    })
});

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    })
});