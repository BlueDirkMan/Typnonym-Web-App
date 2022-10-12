import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';
import { Score } from "./score.js";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
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

userSchema.plugin(passportLocalMongoose)
export const User = mongoose.model("User", userSchema)
