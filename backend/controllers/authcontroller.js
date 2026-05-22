const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const authrepository = require("../repository/authrepository");

exports.registeruser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "name, email, password, and phone are required"
      });
    }

    const existingUser = await authrepository.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "user already exists with this email"
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const user = await authrepository.createUser({
      name,
      email,
      password: hashpassword,
      phone
    });

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required"
      });
    }

    const user = await authrepository.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid email or password"
      });
    }

    const payload = {
      id: user._id,
      email: user.email
    };

    const token = generateToken(payload);
    return res.status(200).json({
      success: true,
      message: "login successful",
      user,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.logoutuser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "logout successful"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
