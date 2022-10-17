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
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

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
app.use(mongoSanitize())
app.use(helmet())

const scriptSrcUrls = [
    // Imported scripts here (if needed for future versions)
];
const styleSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.dictionaryapi.dev/api/v2/entries/en/"
];

const fontSrcUrls = ["https://fonts.gstatic.com", "https://fonts.googleapis.com/"];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "default-src": [],
            "connect-src": ["'self'", ...connectSrcUrls],
            "script-src": ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            "style-src": ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            "worker-src": ["'self'", "blob:"],
            "object-src": [],
            "img-src": [
                "'self'",
                "blob:",
                "data:",
            ],
            "font-src": ["'self'", ...fontSrcUrls],
        },
    })
);



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
    name: "typnonymSession",
    secret: "secretbetweenme",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true, 
        // secure: true,
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
    console.log(req.query)
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
    const allScoreDescending = await Score.find({}).sort({points: -1}).limit(10).populate('owner')
    console.log(allScoreDescending)
    res.render("./main/scoreboard.ejs", { allScoreDescending: allScoreDescending, startValue: 1})
})



app.use('/user', userRouter)
app.use('/user/:userID/score', scoreRouter)





// Catch everything that does not match above
app.all("*", (req, res, next) => {
    next(new AppError("Page Not Found", 404))
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { 
        err.message = "Unexpected error have occurred"
    }
    res.status(status).render("error.ejs", { err: err })
})


// Which Port
app.listen(3003, () => {
    console.log("Listening at Port 3003")
})