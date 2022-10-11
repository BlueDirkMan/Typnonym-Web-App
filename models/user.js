import mongoose from "mongoose";
import { Score } from "./score.js";

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

userSchema.post('findOneAndDelete', async function(user) {
    if (user) {
        await Score.deleteMany({ owner: user._id })
    }
}) 

export const User = mongoose.model("User", userSchema)
