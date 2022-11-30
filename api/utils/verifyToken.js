import jwt  from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // if token doesn't exist
    if (!token) return next(createError(401, "You are not verified"))

    //if token exists but not valid
    //pass the token, then the key to verify the two, and parameters
    jwt.verify(token, process.env.JWT, (err, user) => {
        if(err) return next(createError(403, "Token is no valid!"));
        // we can set new request property 
        req.user = user;
        next()
    })
}


export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            return next(createError(403, "You are not authorized!"))
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if(req.user.isAdmin){
            next();
        } else {
            return next(createError(403, "You are not authorized!"))
        }
    });
};
