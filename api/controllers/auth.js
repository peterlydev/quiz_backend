const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

async function register(req, res) {
    try{
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(req.body.password, salt)
        await User.register({...req.body, password: hashed })
        res.status(201).json({msg: `User created successfully`})
    } catch (error) {
        res.status(500).json({ err: `Username already exists.`})
    }
}

async function login(req, res) {
    try {
        const user = await User.findByUsername(req.body.username);
        if (!user.length) {
            throw new Error("Please enter username");
        }
        const authed = await bcrypt.compare(req.body.password, user.password);
        console.log(authed)

        if (!!authed) {
            const payload = {username: user.username}
            jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 100000}, sendToken)
            // process.env.JWT_SECRET
            function sendToken(err, token){
                if(err) {
                  throw new Error('Token creation failed')
                }
                res.status(200).json({ 
                  success: true,
                  token: `Bearer ${token}` 
                });
              };
        } else {
            throw new Error('User cannot be authenticated')
        }
    } catch (error) {
        res.status(401).json({ error });
    }
}

function verifyToken(req, res, next){
    const header = req.headers['authorization'];
    if(header){
        const token = header.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err,data) => {
            if(err){
                res.status(403).json({ error: `Token didn't pass verification`})
            } else {
                res.status(200)
                next();
            }
        })
    } else {
        res.status(403).json({ error: "Missing token" });
    }
}

module.exports = { register, login, verifyToken }
