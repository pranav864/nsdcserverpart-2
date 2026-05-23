const jwt = require('jsonwebtoken');
require("dotenv").config();

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable must be set');
    }
    return secret;
};

//generate token
exports.generateToken = (payload) => {

    console.log("JWT SECRET INSIDE VERCEL:", process.env.JWT_SECRET);

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

//verify token
exports.verifyToken = (token) => {
    return jwt.verify(
        token,
        getJwtSecret()
    );
};

module.exports = {
    generateToken: exports.generateToken,
    verifyToken: exports.verifyToken
};
