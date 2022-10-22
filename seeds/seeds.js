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

// Making Four User 
const makeNew = async() => {
    const firstUser = new User({
        username: "BlueDirkMan",
        email: "BlueDirkMan@gm.com",
        bio: "I play a lot of league. I main Kayn and Yone."
    });
    const secondUser = new User({
        username: "yuno",
        email: "yuno@gm",
        bio: "i know yuno"
    });
    const thirdUser = new User({
        username: "chicken",
        email: "chicken@gm.com",
        bio: "i love chicken nugget"
    });
    const fourthUser = new User({
        username: "gravityWall",
        email: "gravityWall@gm.com",
        bio: "This is a very good song"
    });
    let firstUserPassword = "thetimeisnowoldman";
    let secondUserPassword = "reverseuno";
    let thirdUserPassword = "nugget";
    let fourthUserPassword = "gravityWall"
    await User.register(firstUser, firstUserPassword);
    await User.register(secondUser, secondUserPassword)
    await User.register(thirdUser, thirdUserPassword)
    await User.register(fourthUser, fourthUserPassword)
    const firstScore = new Score({
        points: 800,
        wpm: 800, 
        date: new Date(),
        owner: firstUser._id
    });
    const secondScore = new Score({
        points: 20, 
        wpm: 80,
        date: new Date(),
        owner: firstUser._id
    });
    const thirdScore = new Score({
        points: 30, 
        wpm: 30,
        date: new Date(),
        owner: secondUser._id
    });
    const fourthScore = new Score({
        points: 999, 
        wpm: 999,
        date: new Date(),
        owner: fourthUser._id
    });
    firstScore.save();
    secondScore.save();
    thirdScore.save();
    fourthScore.save()
}


const runAll = async() => {
    const deleteAllEverything = await deleteAll();
    const makeAllNew = await makeNew();
}
 
runAll()