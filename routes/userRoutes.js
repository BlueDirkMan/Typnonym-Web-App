import express, { Router } from "express";
import { User } from "../models/user.js"; 
import { Score } from "../models/score.js";
import { handlerAsync } from "../utils/handlerAsync.js";
import passport from "passport";
import { isLoggedIn, isAccountOwner, validateUser } from "../utils/utitlityMiddleware.js";
import userController from "../controllers/userController.js";

export const userRouter = express.Router()


// Register Form
userRouter.get("/register", userController.renderRegisterForm)

// Register Post Route
userRouter.post("/", validateUser, handlerAsync(userController.registerUser))

// Login Form
userRouter.get("/login", userController.renderLoginForm)

// Login Post Route
userRouter.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: "/user/login", keepSessionInfo: true,}), userController.userLogin)

// Logout Route
userRouter.get("/logout", userController.userLogout)


// Profile/Show Page  
userRouter.get("/:userID", handlerAsync(userController.renderUserShow))

// Edit Form Page
userRouter.get("/:userID/edit", isLoggedIn, isAccountOwner, handlerAsync(userController.renderUserEdit))

// Edit Patch Route
userRouter.patch("/:userID", isLoggedIn, isAccountOwner, handlerAsync(userController.userUpdate))

// Delete Form Page
userRouter.get("/:userID/delete", isLoggedIn, isAccountOwner, handlerAsync(userController.renderDeleteForm))

// Delete User Route
userRouter.delete("/:userID", handlerAsync(userController.deleteUser))

