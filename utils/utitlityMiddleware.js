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