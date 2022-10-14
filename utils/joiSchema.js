import Joi from "joi";
export const scoreJoiSchema = Joi.object({
    points: Joi.number().required().min(0),
    wpm: Joi.number().required().min(0)
});