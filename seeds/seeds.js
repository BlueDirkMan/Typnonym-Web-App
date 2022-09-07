import mongoose from "mongoose";
import { User } from "../models/user.js";
import { Score } from "../models/score.js";

mongoose.connect('mongodb://127.0.0.1:27017/personalTypingApp')
    .then(()=> {
        console.log("Connected to personalTypingApp")
    })
    .catch((err) => {
        console.log("THERE IS AN ERROR: ")
        console.log(err)
    });


const deleteAll = async() => {
    const deleteAllUser = await User.deleteMany({});
    const deleteAllScore = await Score.deleteMany({});
}

// Making Two User (for when we need to testing authenticattion and authorization)
const makeNew = async() => {
    const firstUser = new User({
        username: "chicken",
        email: "chicken@gm",
        password: "nugget",
        bio: "i love chicken nugget"
    });
    const secondUser = new User({
        username: "yuno",
        email: "yuno@gm",
        password: "noyu",
        bio: "i know yuno"
    });
    firstUser.save();
    secondUser.save();
    const firstScore = new Score({
        points: 10, 
        date: new Date(),
        owner: firstUser._id
    });
    const secondScore = new Score({
        points: 20, 
        date: new Date(),
        owner: firstUser._id
    });
    const thirdScore = new Score({
        points: 30, 
        date: new Date(),
        owner: secondUser._id
    });
    firstScore.save();
    secondScore.save();
    thirdScore.save();
    // Just realized now that I couldn't just done inserting. ffs
    console.log(firstScore.date.toLocaleDateString())
    console.log(firstScore.date.toLocaleTimeString());
}


const runAll = async() => {
    const deleteAllEverything = await deleteAll();
    const makeAllNew = await makeNew();
}
 
runAll()