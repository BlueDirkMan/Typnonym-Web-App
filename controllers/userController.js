import express, { Router } from "express";
import { User } from "../models/user.js"; 
import { Score } from "../models/score.js";
import { handlerAsync } from "../utils/handlerAsync.js";
import passport from "passport";
import { isLoggedIn, isAccountOwner, validateUser } from "../utils/utitlityMiddleware.js";

const userController = new Object();

// Render registration form
const renderRegisterForm = (req, res) => {
    res.render("./user/user_register.ejs", { title: "Register"})
}

// User Register Logic form
const registerUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body; 
        const newUser = new User({ username, email });
        const createdUser = await User.register(newUser, password)
        req.login(createdUser, err => {
            if(err) return next(err);
            req.flash("success", "User Account Registration Completed");
            res.redirect(`/user/${newUser._id}`);
        })
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/user/register")
    }
}

// Render Login Form
export const renderLoginForm = (req, res) => {
    res.render("./user/user_login.ejs", { title: "Login"})
}

// User Login Logic
export const userLogin = (req, res) => {
    req.flash("success", "Successfully login")
    const redirectURL = req.session.lastVisited || "/"
    res.redirect(redirectURL)                          
}

// User Logout Logic
export const userLogout = (req, res) => {
    req.logOut((err) => {
        if (err) { 
            return next(err); 
        }
        req.flash('success', "Succesfully Logout");
        res.redirect("/")
    })   
}

// Render User Show Page
export const renderUserShow = async (req, res) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    if (!searchedUser) {
        req.flash("error", "Cannot find user with specified ID")
        return res.redirect("/")
    }
    const searchedScore = await Score.find({ owner: searchedUser._id}).populate('owner')
    res.render("./user/user_show.ejs", { searchedUser: searchedUser, searchedScore: searchedScore, title: searchedUser.username})
}

// Render User Edit Form To Make Changes To User Data
export const renderUserEdit = async (req, res) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    if (!searchedUser) {
        req.flash("error", "Cannot find user with specified ID")
        return res.redirect("/")
    }
    res.render("./user/user_edit.ejs", { searchedUser: searchedUser, title: "Edit Profile"})
}

// Update User Data Logic
export const userUpdate = async (req, res) => {
    const { userID } = req.params;
    const { email, bio } = req.body
    const editSearchedUser = await User.findByIdAndUpdate(userID, { email: email, bio: bio })
    req.flash("success", "User Account Details Updated")
    res.redirect(`/user/${userID}`)
}

// Render Delete Form
export const renderDeleteForm = async (req, res) => {
    const { userID } = req.params;
    const searchedUser = await User.findById(userID)
    if (!searchedUser) {
        req.flash("error", "Cannot find user with specified ID")
        return res.redirect("/")
    }
    res.render("./user/user_delete", { searchedUser: searchedUser, title: "Confirm Delete"})
}

// Delete User Logic
export const deleteUser = async (req, res) => {
    const { userID } = req.params;
    const deleteUser = await User.findByIdAndDelete(userID)
    req.flash("success", "User Account Deleted")
    res.redirect("/")
}

// Make functions available under default export object, but leaving it as a standalone export too for flexibility
userController.renderRegisterForm = renderRegisterForm
userController.registerUser = registerUser 
userController.renderLoginForm = renderLoginForm
userController.userLogin = userLogin
userController.userLogout = userLogout
userController.renderUserShow = renderUserShow
userController.renderUserEdit = renderUserEdit
userController.userUpdate = userUpdate
userController.renderDeleteForm = renderDeleteForm
userController.deleteUser = deleteUser

// Export controller
export default userController