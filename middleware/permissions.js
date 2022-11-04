//Function to handle permissions to access protected routes

const User = require("../models/User");
const jwt = require("jsonwebtoken"); 

//ensure user is authorised to access protected private routes
const requiresAuth = async(req, res, next) => {
    const token = req.cookies["access-token"];
    let isAuthed = false;
//verify user
    if(token) {
        try {
            const {userId} = jwt.verify(token, process.env.JWT_SECRET);
            try {
                const user = await User.findById(userId);
                if(user) {
                    const userToReturn = {...user._doc};
                    delete userToReturn.password;
                    req.user = userToReturn;
                    isAuthed = true
                }
            
            } catch {
                isAuthed = false;
            }
        } catch {
            isAuthed = false;
        }
    }
    //if user is authorised allow to proceed otherwise inform user that they are unauthorised.
    if(isAuthed) {
        return next();
    }else {
        return res.status(401).send("Unauthorized.")
    }
}

module.exports = requiresAuth;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow