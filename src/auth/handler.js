const moment = require("moment");
const db = require("../models");
const { register } = require("./service");
const transformResponse = require("../common/transform-response");
const { comparePassword } = require("./helpers/password-helper");

exports.register = async (req, res, next) => {
  try {
    await register(req.body);
    transformResponse({
      statusCode: 201,
      res,
      message: "User created successfully",
    });
  } catch (error) {
    next(error)
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isFound = await db.User.findOne({
      where: { email }
    });
    if (!isFound) {
      transformResponse({
        statusCode: 400,
        res,
        message: "Invalid email or password"
      });
    }
    const isPasswordValid = await comparePassword(password, isFound.password);

    if (isPasswordValid === false &&
        isFound.is_locked &&
        moment().isBefore(isFound.next_unlock_time)
      ) {
        transformResponse({
        statusCode: 400,
        res,
        message: "Your account will be locked for life"
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
      transformResponse({
        statusCode: 400,
        res,
        message: "You cannot login at the momment"
      })
    }

    if (!isPasswordValid) {
      if (isFound.login_attempts >= 3) {
        await db.User.update({
          is_locked: true,
          next_unlock_time: moment().add(1, "minutes").valueOf()
        }, {where: {email}});
        transformResponse({
          statusCode: 400,
          res,
          message: "Your account has been locked for 1 minute"
        });
      } else {
        await db.User.update({
          login_attempts: isFound.login_attempts + 1,
        }, {where: {email}});
        transformResponse({
          statusCode: 400,
          res,
          message: "Invalid email or password"
        })
      }
    }
    await db.User.update({
      login_attempts: 0,
      is_locked: false,
      next_unlock_time: null
    }, {where: {email}});
    
    transformResponse({
      statusCode: 200,
      res,
      message: "Login successful",
    })

  } catch (error) {
    next(error)
  }
};