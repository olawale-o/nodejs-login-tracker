const db = require("../models");
const { hashPassword, comparePassword } = require("./helpers/password-helper");

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const isFound = await db.User.findOne({
      where: { email }
    });
  
    if (isFound) {
      return res.status(400).json({
        message: "Email already exists. Please login with your credentials."
      });
    }
    const hashedPassword = await hashPassword(password);
  
    const user = await db.User.create({
      full_name: fullName,
      email,
      password: hashedPassword
    });
  
    if (!user) {
      return res.status(500).json({
        message: "Something went wrong. Please try again."
      });
    }
    res.status(201).json({
      message: "User created successfully.",
      data: user
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {};