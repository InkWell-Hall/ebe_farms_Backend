import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { loginSchema, userSchema } from '../schemas/user-schema.js';
import { User } from '../models/user-model.js';
import { SECRET } from '../config/env.js';



export const signUp = async(req,res)=>{
    try {
        // validation
        const {error,value} = userSchema.validate(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message})
        }

        const {email,password} = value;
        // check if account exist by email, if not continue with the registration by hashing the password
        const userFinder = await User.findOne({email})
        if(userFinder){
            return res.status(400).json({message:`User with this Email:${email} already exist`})
        }else{
            // hash password
            const hashPassword = await bcrypt.hash(password,12);
            console.log('HashPassword',hashPassword)

            // create account
            const createAccount = await User.create({
                ...value,
                password:hashPassword
            })
            console.log('New Account',createAccount)
            return res.status(200).json({message:'User Register Successfully🎉'})
        }

    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}

export const login = async(req,res) =>{
    try {
        const {error,value} = loginSchema.validate(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message});
        };

        const {email,password} =value;
        // check if account exist by email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:`Invalid Credentials`})
        };
        // lets compare the password to the hashPassword in the db
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        };
        // generate token to the user
        const token = jwt.sign(
            {id:user.id},
            SECRET,
            {expires:'1d'}
        );
        return res.status(200).json(
            {message:'Login Successful🎉'},
            token,
            user
        );
    } catch (error) {
        return res.status(500).json({message:error.message})
    };
};