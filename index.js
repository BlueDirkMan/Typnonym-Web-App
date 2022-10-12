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
import engine from "ejs-mate";
import { userRouter } from "./routes/userRoutes.js";
import { scoreRouter } from "./routes/scoreRoutes.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// app.engine('ejs', engine);
// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));
// app.use(express.static(path.join(__dirname, "/public")));
// app.use(methodOverride("__method"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("__method"));

app.engine("ejs", engine)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// Mongoose Connection
mongoose.connect('mongodb://127.0.0.1:27017/personalTypingApp')
    .then(() => {
        console.log("Connected to personalTypingApp")
    })
    .catch((err) => {
        console.log("THERE IS AN ERROR: ")
        console.log(err)
    });

const sessionCofiguration = {
    secret: "secretbetweenme",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionCofiguration))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    console.log(req.session)
    res.locals.flashSuccess = req.flash("success");
    res.locals.flashError = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

// Homepage + typing page
app.get("/", (req, res) => {
    res.render("./main/homepage.ejs")
})

// Scoreboard
app.get("/scoreboard", async (req, res) => {
    const allUser = await User.find({});
    res.render("./main/scoreboard.ejs", { allUser: allUser })
})



app.use('/user', userRouter)
app.use('/user/:userID/score', scoreRouter)





// Catch everything that does not match above
app.all("*", (req, res, next) => {
    next(new AppError("Page Not Found", 404))
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { status = 500, message } = err
    res.status(status).render("error.ejs", { message: message })
})


// Which Port
app.listen(3003, () => {
    console.log("Listening at Port 3003")
})