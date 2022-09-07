import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
        // minLength: 5,
        // maxLength: 25        ---- I think we can do these with Joi schema
    }, 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: { 
        type: String,
        default: "This user have not made a bio"
    }
})

export const User = mongoose.model("User", userSchema)
