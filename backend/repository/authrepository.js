const bcrypt = require("bcrypt");
const User = require("../models/userModel");


// ================= CREATE USER =================

exports.createUser = async (userData) => {

    try {

        const newUser = new User(userData);

        return await newUser.save();

    }

    catch (error) {

        throw error;

    }

};


// ================= FIND USER BY EMAIL =================

exports.findUserByEmail = async (email) => {

    try {

        return await User.findOne({ email }).select("+password");

    }

    catch (error) {

        throw error;

    }

};


// ================= COMPARE PASSWORD =================

exports.comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};