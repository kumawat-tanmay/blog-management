import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import {generateToken} from '../utils/generateToken.js'

export const signup = async (req, res) => {

    try {

        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(200).json({
                success: false,
                message: "All fields are required",
            })
        }

        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)

        const newUser = await userModel.create({
            name, 
            email, 
            password: hashedPass, 
            role: "viewer"
        })

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            token: generateToken(newUser),
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Signup failed",
            error: error.message,
        });
    }

}

export const login = async (req, res) => {
    try {
        
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        
        return res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateToken(user),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
}