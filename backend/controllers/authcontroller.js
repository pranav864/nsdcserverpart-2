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

    const user = await authrepository.createUser({
      name,
      email,
      password,
      phone
    });

    const returnedUser = user.toObject();
    delete returnedUser.password;

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: returnedUser
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
  exports.loginuser = async (req, res) => {
  try {

    console.log("LOGIN STARTED");

    const { email, password } = req.body;

    console.log("BODY:", req.body);

    const user = await authrepository.findUserByEmail(email);

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid email or password"
      });
    }

    const isMatch = await authrepository.comparePassword(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    const payload = {
      id: user._id,
      email: user.email
    };

    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = generateToken(payload);

    console.log("TOKEN CREATED");

    return res.status(200).json({
      success: true,
      token
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
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
