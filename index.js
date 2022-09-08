// From My Personal Web Dev Cheat Sheet Start-Up Code
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";
import methodOverride from "method-override";
import mongoose from "mongoose";

//
import { User } from "./models/user.js"; 
import { Score } from "./models/score.js";
import { AppError } from "./utils/AppError.js";
import { handlerAsync } from "./utils/handlerAsync.js";
import Joi from "joi";
import { validateScore } from "./utils/utitlityMiddleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("__method"));


// Mongoose Connection
mongoose.connect('mongodb://127.0.0.1:27017/personalTypingApp')
    .then(()=> {
        console.log("Connected to personalTypingApp")
    })
    .catch((err) => {
        console.log("THERE IS AN ERROR: ")
        console.log(err)
    });
















// Routes - Will be restructured
// Home (also play page)  = /
// ScoreBoard = /scoreboard
// Register = /user/register 
// Register Route Post= /user
// Login = /user/login
// Login Route = /user/:userID/login - i don't think this is how Colt would have structure it
// Profile = /user/:userID

// Homepage + typing page
app.get("/", (req, res) => {
    res.render("./main/homepage.ejs")
})

// Scoreboard
app.get("/scoreboard", async (req, res) => {
    const allUser = await User.find({});
    res.render("./main/scoreboard.ejs", { allUser: allUser})
})

// Register Form
app.get("/user/register", (req, res) => {
    res.render("./user/user_register.ejs")
})

// Register Post Route
app.post("/user", handlerAsync(async (req, res, next) => {
    const { username, password, email } = req.body; // obviously, this won't be actual, we'll use passport
    const newUser = new User({ username, password, email });
    const createNewUser = await newUser.save()
    console.log("-------------")
    console.log("New User Registered")
    res.redirect(`/user/${newUser._id}`)
}))

// Login Form
app.get("/user/login", (req, res) => {
    res.render("./user/user_login.ejs")
})

// Login Post Route
app.post("user/login", (req, res) => {
    const { username, password } = req.body 
    res.redirect("/")                           // Decided to do related to login at authorization instead
})

// Profile/Show Page   --- I don't think we can do this page access until we have authentication and auth
// We can manually type the ID in though
app.get("/user/:userID", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    const searchedScore = await Score.find({ user: searchedUser._id}).populate('owner')
    console.log("-------------")
    console.log("Find User For Profile Page")
    console.log(searchedUser)
    res.render("./user/user_show.ejs", { searchedUser: searchedUser, searchedScore: searchedScore})
}))


// Edit Form = /user/:userID/edit
// Edit Patch Route = /user/:userID
// Delete Form (confirmation basically) = /user/:userID/delete
// Delete Delete Route = /user/:userID


// Edit Form Page
app.get("/user/:userID/edit", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    console.log("-------------")
    console.log("Find User For Edit Page")
    console.log(searchedUser)
    res.render("./user/user_edit.ejs", { searchedUser: searchedUser})
}))

// Edit Patch Route
app.patch("/user/:userID", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const { email, bio } = req.body
    const editSearchedUser = await User.findByIdAndUpdate(userID, { email: email, bio: bio })
    res.redirect(`/user/${userID}`)
}))

// Delete Form Page
app.get("/user/:userID/delete", handlerAsync(async (req, res) => {
        const { userID } = req.params;
        const searchedUser = await User.findById(userID)
        res.render("./user/user_delete", { searchedUser: searchedUser })
}))

// Delete User Route
app.delete("/user/:userID", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const deleteUser = await User.findByIdAndDelete(userID)
    res.redirect("/")
}))







// Score adding page - will be done through homepage after sessions is implemented
app.get("/user/:userID/score", handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    res.render("./user/user_score.ejs", { searchedUser: searchedUser })
}))



// Score Post Route
app.post("/user/:userID/score", validateScore, handlerAsync(async (req, res) => {
    const { userID } = req.params;
    const newScore = new Score({ points: req.body.points, date: new Date(), owner: userID })
    const savedScore = await newScore.save()
    res.redirect(`/user/${userID}`)
}))








// Catch everything that does not match above
app.all("*", (req, res, next) => {
    next(new AppError("Page Not Found", 404))
})

// Error Handling Middleware
app.use((err, req, res, next)=>{
    const { status = 500, message } = err
    res.status(status).render("error.ejs", { message: message})
})


// Which Port
app.listen(3003, ()=>{ 
    console.log("Listening at Port 3003")
})