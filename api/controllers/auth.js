import User from "../models/User.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from "../utils/error.js";

export const register = async(req, res, next) => {
    try{
        // Secure/Hash password with bcryptjs
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt)

        const newUser = await User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })

        await newUser.save()
        res.status(200).send("User has been created successfully")
    }catch (err){
        next(err)
    }
}


export const login = async(req, res, next) => {
    try{
        // Check if user exists
        const user = await User.findOne({username: req.body.username});
        if (!user) return next(createError(404, "User not found"))

        // Check if password is correct and compare with Mongo user.password
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordCorrect) return next(createError(400, "Wrong password or username"))
        
        // Destructure details to hide details from the appearing in the client
        const { password, isAdmin, ...otherDetails} = user._doc;

        // Json web token create a token when the user isAdmin
        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT)

        // access_token is the name of the token, pass the token inside the cookie and add httpOnly to prevent client secrets from reaching the cookie
        res.cookie("access_token", token, {httpOnly: true}).status(200).json({...otherDetails})
    }catch (err){
        next(err)
    }
}