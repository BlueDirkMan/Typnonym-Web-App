import Joi from "joi";
export const scoreJoiSchema = Joi.object({
    points: Joi.number().required().min(0)
});