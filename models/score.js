import mongoose from "mongoose";


const scoreSchema = new mongoose.Schema({
    points: {
        type: Number,
        required: true
    },
    wpm: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Score = mongoose.model("Score", scoreSchema)
