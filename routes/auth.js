//import modules
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require ("../validation/registerValidation");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middleware/permissions");



//Route: GET /api/auth/test is for testing auth route
router.get("/test", (req, res) => {
    res.send("Auth route working");
})

//Route: POST /api/auth/register is for new user creation; validate email and password. Otherwise send error if not valid.
router.post("/register", async(req, res) => {
    try {
        const {errors, isValid} = validateRegisterInput(req.body);
        if(!isValid) {
            return res.status(400).json(errors);
        }
//check for existing user email; if already in use whether email is written in lower or uppercase; error is send
const existingEmail = await User.findOne({
    email: new RegExp ("^"+ req.body.email + "$", "i")
    });
    
    if (existingEmail) {
        return res.status(400).json({error: "Email already is use."});
    }
//hash/hide password and give it a 12 character string
    const hashedPassword = await bcrypt.hash(req.body.password, 12);        
//create new user
    const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
    }) ;
//save user to database    
    const savedUser = await newUser.save();

    //assisgn jwt token
    const payload = {userId: savedUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: "7d"
    });
    //Set cookies
    res.cookie("access-token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    });

    const userToReturn = {...savedUser._doc}
    delete userToReturn.password;
    return res.json(userToReturn);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);   
    }
});

//Route: POST /api/auth/login is for login of user and return access token
router.post("/login", async(req, res) => {
    try {
        //check for the user. If email and password match then login successfully or send error if the credentials do not match
    const user = await User.findOne({
        email: new RegExp ("^"+ req.body.email + "$", "i") 
    })
    if (!user) {
        return res
        .status(400)
        .json({error: "There was an issue with your login credentials."})
    }
    //assisgn jwt token
    const payload = {userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: "7d"
    });
    //Set cookies
    res.cookie("access-token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    });

    const userToReturn = {...user._doc};
    delete userToReturn.password;
    return res.json({
        token: token,
        user: userToReturn,
    })
    const passwordMatch = await bcrypt.compare(
        req.body.password, 
        user.password);

    if(!passwordMatch) {
        return res
        .status(400)
        .json({error: "There was an issue with your login credentials."})
    }
   
    }catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
})

//Route: GET /api/auth/current is for login of user and return the currently authorised user

router.get("/current", requiresAuth,(req, res) => {
    if(!req.user) {
        return res.status(401).send("Unauthorized");
    }
    return res.json(req.user);
});

//Route: POST /api/auth/logout is for user to logout and clear the cookie
router.put("/logout", requiresAuth, async(req, res) => {
    try {
        res.clearCookie("access-token");
        return res.json({success: true});
    }catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
})

module.exports = router;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow