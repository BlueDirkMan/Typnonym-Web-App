import express from "express";
import { User } from "../models/user.js"; 
import { Score } from "../models/score.js";
import { handlerAsync } from "../utils/handlerAsync.js";

export const userRouter = express.Router();


// Register Form
userRouter.get("/register", (req, res) => {
    res.render("./user/user_register.ejs")
})

// Register Post Route
userRouter.post("/", handlerAsync(async (req, res, next) => {
    const { username, password, email } = req.body; // obviously, this won't be actual, we'll use passport
    const newUser = new User({ username, password, email });
    const createNewUser = await newUser.save()
    console.log("-------------")
    console.log("New User Registered")
    req.flash("success", "User Account Registeration Completed")
    res.redirect(`/user/${newUser._id}`)
}))

// Login Form
userRouter.get("/login", (req, res) => {
    res.render("./user/user_login.ejs")
})

// Login Post Route
userRouter.post("/login", (req, res) => {
    const { username, password } = req.body 
    res.redirect("/")                           // Decided to do related to login at authorization instead
})

// Profile/Show Page   --- I don't think we can do this page access until we have authentication and auth
// We can manually type the ID in though
userRouter.get("/:userID", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    if (!searchedUser) {
        req.flash("error", "Cannot find user with specified ID")
        return res.redirect("/")
    }
    const searchedScore = await Score.find({ owner: searchedUser._id}).populate('owner')
    console.log("-------------")
    console.log("Find User For Profile Page")
    console.log(searchedUser)
    console.log("With Scores: ")
    console.log(searchedScore)
    res.render("./user/user_show.ejs", { searchedUser: searchedUser, searchedScore: searchedScore})
}))


// Edit Form Page
userRouter.get("/:userID/edit", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    if (!searchedUser) {
        req.flash("error", "Cannot find user with specified ID")
        return res.redirect("/")
    }
    console.log("-------------")
    console.log("Find User For Edit Page")
    console.log(searchedUser)
    res.render("./user/user_edit.ejs", { searchedUser: searchedUser})
}))

// Edit Patch Route
userRouter.patch("/:userID", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const { email, bio } = req.body
    const editSearchedUser = await User.findByIdAndUpdate(userID, { email: email, bio: bio })
    req.flash("success", "User Account Details Updated")
    res.redirect(`/user/${userID}`)
}))

// Delete Form Page
userRouter.get("/:userID/delete", handlerAsync(async (req, res) => {
        const { userID } = req.params;
        const searchedUser = await User.findById(userID)
        if (!searchedUser) {
            req.flash("error", "Cannot find user with specified ID")
            return res.redirect("/")
        }
        res.render("./user/user_delete", { searchedUser: searchedUser })
}))

// Delete User Route
userRouter.delete("/:userID", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const deleteUser = await User.findByIdAndDelete(userID)
    req.flash("success", "User Account Deleted")
    res.redirect("/")
}))




