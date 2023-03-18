const moment = require("moment");
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isFound = await db.User.findOne({
      where: { email }
    });
    if (!isFound) {
      return res.status(400).json({
        message: "Invalid email or password."
      });
    }
    const isPasswordValid = await comparePassword(password, isFound.password);

    if (isPasswordValid === false &&
        isFound.is_locked &&
        moment().isBefore(isFound.next_unlock_time)
      ) {
      return res.status(400).json({
        message: "Your account will be locked for life.",
      });
    }

    if (isPasswordValid === false &&
        isFound.is_locked &&
        moment().isAfter(isFound.next_unlock_time)
      ) {
      isFound.login_attempts = 0;
      await db.User.update({
        is_locked: false,
        next_unlock_time: null,
        login_attempts: 0
      }, {where: {email}});
    }

    if (isPasswordValid && isFound.is_locked && moment().isAfter(isFound.next_unlock_time)) {
      isFound.login_attempts = 0;
      await db.User.update({
        is_locked: false,
        next_unlock_time: null,
        login_attempts: 0
      }, {where: {email}});
    }

    if (isPasswordValid && isFound.is_locked && moment().isBefore(isFound.next_unlock_time)) {
      return res.status(400).json({
        message: "You cannot login at the momment.",
      });
    }

    if (!isPasswordValid) {
      if (isFound.login_attempts >= 3) {
        await db.User.update({
          is_locked: true,
          next_unlock_time: moment().add(1, "minutes").valueOf()
        }, {where: {email}});
        return res.status(400).json({
          message: "Your account has been locked for 1 minute.",
        });
      } else {
        await db.User.update({
          login_attempts: isFound.login_attempts + 1,
        }, {where: {email}});
        return res.status(400).json({
          message: "Invalid email or password.",
        });
      }
    }
    await db.User.update({
      login_attempts: 0,
      is_locked: false,
      next_unlock_time: null
    }, {where: {email}});
    
    
    return res.status(200).json({
      message: "Login successful.",
    });

  } catch (error) {
    console.log(error);
  }
};