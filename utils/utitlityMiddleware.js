import Joi from "joi";
import { scoreJoiSchema } from "./joiSchema.js"
import { AppError } from "./AppError.js";
import { User } from "../models/user.js";

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

// Middleware for authorization, checking whether currentUser._id (logged in user) is the same as 
// The searchedUser (ex. user1 tries to access edit page of user2 - stop this from happening/working) 
export const isAccountOwner = async (req, res, next) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    if (!req.user || !req.user._id.equals(searchedUser._id)) {
        req.flash('error', "You do not have permission for that action")
        return res.redirect("/")
    } 
    next()
}