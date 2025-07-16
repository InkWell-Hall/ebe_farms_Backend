import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { adminloginSchema, adminSchema, forgetPasswordSchema, loginSchema, passwordResetSchema, userSchema } from '../schemas/user-schema.js';
import { User } from '../models/user-model.js';
import { adminVerify, CLIENT_URL, SECRET } from '../config/env.js';
import crypto from 'crypto';
import { otpGenerator } from '../utils/additionals.js';
import { sendForgetPasswordEmail, sendOtpEmail } from '../utils/mail.js';


export const signUp = async (req, res) => {
    try {
        // validation
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const { email, password } = value;
        // check if account exist by email, if not continue with the registration by hashing the password
        const userFinder = await User.findOne({ email })
        if (userFinder) {
            return res.status(400).json({ message: `User with this Email:${email} already exist` })
        } else {
            // hash password
            const hashPassword = await bcrypt.hash(password, 12);
            console.log('HashPassword', hashPassword)

            // otp for verification of mail
            const otp = otpGenerator(4)
            const hashotp = await bcrypt.hash(otp, 12);
            console.log("hashotp", hashotp, otp)

            // save the new user details in the database using the format below.
            const createAccount = await User.create({
                ...value,
                password: hashPassword,
                otp: hashotp,
                otpExpiresAt: Date.now() + 300000
            });
            console.log('New Account', createAccount)
            // send mail
            const sendotpmail = await sendOtpEmail(email, otp);
            console.log('OTP MAIL', sendotpmail)
            // generate token to the user
            const token = jwt.sign(
                { id: createAccount.id },
                SECRET,
                { expiresIn: '1d' }
            );
            return res.status(200).json({ message: 'User Register Successfully🎉', createAccount, token })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

export const adminsignUp = async (req, res) => {
    try {
        // validation
        const { error, value } = adminSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const { email, password, adminCode } = value;
        // check if the admin code is correct
        if(adminCode !== adminVerify){
            return res.status(400).json({message:'wrong admin code'})
        }
        // check if account exist by email, if not continue with the registration by hashing the password
        const userFinder = await User.findOne({ email })
        if (userFinder) {
            return res.status(400).json({ message: `User with this Email:${email} already exist` })
        } else {
            // hash password
            const hashPassword = await bcrypt.hash(password, 12);
            console.log('HashPassword', hashPassword)

            // otp for verification of mail
            const otp = otpGenerator(4)
            const hashotp = await bcrypt.hash(otp, 12);
            console.log("hashotp", hashotp, otp)

            // save the new user details in the database using the format below.
            const createAccount = await User.create({
                ...value,
                password: hashPassword,
                otp: hashotp,
                otpExpiresAt: Date.now() + 300000
            });
            console.log('New Account', createAccount)
            // send mail
            const sendotpmail = await sendOtpEmail(email, otp);
            console.log('OTP MAIL', sendotpmail)
            // generate token to the user
            const token = jwt.sign(
                { id: createAccount.id },
                SECRET,
                { expiresIn: '1d' }
            );
            return res.status(200).json({ message: 'User Register Successfully🎉', createAccount, token })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

export const resendOtp = async (req, res) => {
    try {
        const userID = req.user.id;
        if (!userID) {
            return res.status(400).json({ message: 'not authorize' })
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = otpGenerator(4)
        const hashotp = await bcrypt.hash(otp, 12);
        console.log("hashotp", hashotp, otp)

        // Update user's OTP and expiration time
        user.otp = hashotp;
        user.otpExpiresAt = Date.now() + 300000; // 5 minutes from now
        const updatedUser = await user.save();
        console.log('Updated User', updatedUser)
        // Send OTP email
        const sendotpmail = await sendOtpEmail(user.email, otp);
        console.log('OTP MAIL', sendotpmail)
        return res.status(200).json({ message: 'OTP resent successfully', updatedUser });
        
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}

export const verifyOtp = async (req, res) => {
    try {
        const userID = req.user.id
        const { otp } = req.body;

        // Find user with matching OTP and expiration time
        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Verify OTP
        const isValidOtp = await bcrypt.compare(otp, user.otp);
        if (!isValidOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid, proceed with verification
        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        const verifiedUser = await user.save();
        console.log('Verified User', verifiedUser)

        return res.status(200).json({ message: 'OTP verified successfully', verifiedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };

        const { email, password } = value;
        // check if account exist by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: `Invalid Credentials` })
        };
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Account not verified' });
        }
        // lets compare the password to the hashPassword in the db
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        };
        // generate token to the user
        const token = jwt.sign(
            { id: user.id },
            SECRET,
            { expiresIn: '1d' }
        );
        return res.status(200).json({ message: 'Login Successful🎉', token, user });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};

export const adminlogin = async (req, res) => {
    try {
        const { error, value } = adminloginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };

        const { email, password, adminCode } = value;
         // check if the admin code is correct
        if(adminCode !== adminVerify){
            return res.status(400).json({message:'wrong admin code'})
        }
        // check if account exist by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: `Invalid Credentials` })
        };
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Account not verified' });
        }
        // lets compare the password to the hashPassword in the db
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        };
        // generate token to the user
        const token = jwt.sign(
            { id: user.id },
            SECRET,
            { expiresIn: '1d' }
        );
        return res.status(200).json({ message: 'Login Successful🎉', token, user });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};

// resetting password
// export const forgetPassword = async (req, res) => {
//   try {
//     const { error, value } = passwordResetSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const { email, newPassword } = value;

//     // Check if account exists by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: `Invalid Credentials` });
//     }

//     // Hash new password
//     const newHashPassword = await bcrypt.hash(newPassword, 12);

//     // Update user password
//     user.password = newHashPassword;
//     await user.save();

//     // Generate token
//     const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' });

//     return res.status(200).json({
//       message: 'Password Reset Successful',
//       token,
//       user: { id: user.id, email: user.email },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };


export const forgotPassword = async (req, res) => {
    try {
        const { error, value } = forgetPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await User.findOne({ email: value.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        await User.findByIdAndUpdate(user.id, {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: Date.now() + 3600000, // expires in 1 hour
        });

        const { email } = value;
        const passwordResetLink = `${CLIENT_URL}/reset-password/${token}`;

        const sentmail = await sendForgetPasswordEmail(email, passwordResetLink);
        console.log('Sent forget Password link', sentmail);
        return res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


export const resetPassword = async (req, res) => {
    try {
        // getting the uerID from the token
        const userID = req.user.id
        const { error, value } = passwordResetSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { newPassword } = value;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        const newPasswordData = await user.save();

        return res.status(200).json({ message: 'Password reset successful', newPasswordData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const allUser = async (req, res) => {
    try {
        const alluser = await User.find();
        return res.status(200).json({ message: 'All the users available', alluser });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


// export const signUpn = async (req, res) => {
//   try {
//     // Validation
//     const { error, value } = userSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const { email, password } = value;

//     // Check if account exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: `User with this Email:${email} already exists` });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Generate OTP token
//     const otpToken = crypto.randomBytes(32).toString('hex');
//     const hashedOtpToken = crypto.createHash('sha256').update(otpToken).digest('hex');

//     // Save user data
//     const user = await User.create({
//       ...value,
//       password: hashedPassword,
//       otpToken: hashedOtpToken,
//       otpTokenExpiresAt: Date.now() + 60000,
//     });

//     // Send OTP link to user's email
//     const otpLink = `${CLIENT_URL}/verify-account/${otpToken}`;
//     await sendOtpEmail(user.email, otpLink);

//     return res.status(200).json({ message: 'User registered successfully. Please verify your email.' });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const verifyAccount = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
//     const user = await User.findOne({ otpToken: hashedToken, otpTokenExpiresAt: { $gt: Date.now() } });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     // Token is valid, proceed with verification
//     user.isVerified = true;
//     user.otpToken = null;
//     user.otpTokenExpiresAt = null;
//     await user.save();

//     return res.status(200).json({ message: 'Account verified successfully' });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
