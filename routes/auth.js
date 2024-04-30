const router =  require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const {registerValidation,loginValidation} = require("../validation");


//register
router.post("/register",async(req,res) =>{

    //validation
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    //check already exist or not
    const emailExist = await User.findOne({email:req.body.email});

    if(emailExist) return res.status(400).send("email already registered");

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword  = await bcrypt.hash(req.body.password,salt)


    //create new user
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({user:user._id})
    } catch (error) {
        res.status(400).send(error);
    }

});


//login

router.post('/login',async(req,res) =>{

    //validation
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //check already exist or not
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("email doesnt exist");

    //check password correct or not 
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("password is incorrect");

    // create and assign token
    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

})

module.exports = router; 