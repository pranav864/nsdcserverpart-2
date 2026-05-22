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

        return await User.findOne({ email });

    }

    catch (error) {

        throw error;

    }

};