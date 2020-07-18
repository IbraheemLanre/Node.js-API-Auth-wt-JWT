const router = require('express').Router();
const User = require('../dbModel/User');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../routes/validation');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {

    // VALIDATE DATA BEFORE WE MAKE A USER
    const {error} = registerValidation(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }
    
    // Checking if the user is already on the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) {
        return res.status(400).send('Email already exists');
    }

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

     // Cretae a new user
     const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err) {
        res.status(400).send(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    // VALIDATE DATA BEFORE WE MAKE A USER
    const {error} = loginValidation(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }

    // Check if email already exist
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send('Email/password is incorrect');
    }

    // PASWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) {
        return res.status(400).send('Email/password is incorrect');
    }
    
    // Create and assing a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send('Logged in!');

});

module.exports = router;