import User from "../models/User.js"
import bcrypt from 'bcryptjs';

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