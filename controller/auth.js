import User from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: 'User Account already exists.' })
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser=await User.create({ name, email, password:hashedPassword })
        const token=jwt.sign({email:newUser.email,_id:newUser._id},process.env.JWT_SECRET,{expiresIn:'1h'})
        const user={name:newUser.name,_id:newUser._id,savedStories:newUser.savedStories}
        res.status(200).json({message:'User account created successfully',token,user })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal Server Error.'})
    }

}

export const login = async(req, res) => {
    const {email,password} =req.body;
    try {
        const user=await User.findOne({email})
        if (!user) {
            return res.status(404).json({message:"User account not found"})
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({message:"Invalid password"})
        }

        const token=jwt.sign({email:user.email,_id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})
            res.status(200).json({message:"Logged in successfully.",token:token,user:{name:user.name,_id:user._id,savedStories:user.savedStories}})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server Error'})
    }
}