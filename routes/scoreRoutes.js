import express from "express";
import { User } from "../models/user.js"; 
import { Score } from "../models/score.js";
import { handlerAsync } from "../utils/handlerAsync.js";
import { validateScore } from "../utils/utitlityMiddleware.js";

export const scoreRouter = express.Router({ mergeParams: true});

// Score adding page - will be done through homepage after sessions is implemented
scoreRouter.get("/", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    if (!searchedUser) {
        req.flash("error", "Cannot find user with specified ID")
        return res.redirect("/")
    }
    res.render("./user/user_score.ejs", { searchedUser: searchedUser })
}))


// Score Post Route
scoreRouter.post("/", validateScore, handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const newScore = new Score({ points: req.body.points, date: new Date(), owner: userID })
    const savedScore = await newScore.save()
    req.flash('success', 'Successfully added score')
    res.redirect(`/user/${userID}`)
}))
