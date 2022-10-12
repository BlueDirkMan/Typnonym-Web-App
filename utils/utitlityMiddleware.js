import Joi from "joi";
import { scoreJoiSchema } from "./joiSchema.js"
import { AppError } from "./AppError.js";

// Middleware to validate score through Joi schema. Throws Error if validation failed, if not passes to next
export const validateScore = (req, res, next) => {
    const validationResult = scoreJoiSchema.validate(req.body)
    console.log("Validation Result:")
    console.log(validationResult)
    const { error } = validationResult
    if (validationResult.error) {
        const message = error.details.map(el => el.message).join(",")
        throw new AppError(message, 400)
    } 
    else {
        next()
    }
}

// Middleware to check whether user is currently login using passport built-in method
export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.lastVisited = req.originalUrl;
        req.flash("error", "Must Be Signed In To Perform Specified Action")
        return res.redirect("/user/login")
    } 
    next();
}