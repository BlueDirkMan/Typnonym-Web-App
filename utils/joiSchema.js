import Joi from "joi";
import sanitizeHtml from 'sanitize-html';

// for joi html extension
const joiExtension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} cannot include html tags or html elements'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return (helpers.error('string.escapeHTML', { value }))
                return clean
            },
        }
    }
});

const improvedJoi = Joi.extend(joiExtension)


export const scoreJoiSchema = improvedJoi.object({
    points: improvedJoi.number().required().min(0),
    wpm: improvedJoi.number().required().min(0)
});


export const userJoiSchema = improvedJoi.object({
    email: improvedJoi.string().required().email().max(100).escapeHTML(),
    bio: improvedJoi.string().max(100).escapeHTML(),
    username: improvedJoi.string().required().max(100).escapeHTML(),
    password: improvedJoi.string().required().min(6).max(100)
});