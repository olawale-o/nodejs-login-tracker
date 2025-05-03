const db = require("../../models");
const findByEmail = async ({ email }) => {
  try {
    const user = await db.User.findOne({
      where: { email },
    });

    if (user) {
      return user;
    }
    return false;
  } catch (error) {
    console.error(error);
    throw new AppError(
      500,
      "Something went wrong. Could not find user at this time. Please try again later",
    );
  }
};

const create = async (credentials) => {
  try {
    const user = await db.User.create({
      ...credentials,
    });
    return user;
  } catch (error) {
    console.error(error);
    throw new AppError(
      500,
      "Something went wrong. Could not create user at this time. Please try again later",
    );
  }
};

const update = async (update, filter) => {
  try {
    await db.User.update(update, filter);
    return true;
  } catch (error) {
    console.error(error);
    throw new AppError(
      500,
      "Something went wrong. Could not update user at this time. Please try again later",
    );
  }
};

module.exports = { findByEmail, create, update };
