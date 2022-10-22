import { Score } from "../models/score.js";

const scoreController = new Object()

// Create New Score Logic To Be Passed to score POST route
export const createScore = async (req, res) => {
    console.log("req")
    console.log(req)
    const { userID } = req.params;
    const newScore = new Score({ points: req.body.points, wpm: req.body.wpm, date: new Date(), owner: userID })
    const savedScore = await newScore.save()
    req.flash('success', 'Successfully added score')
    res.redirect(`/user/${userID}`)
}

// Make functions available under default export object, but leaving it as a standalone export too for flexibility
scoreController.createScore = createScore

// 
export default scoreController