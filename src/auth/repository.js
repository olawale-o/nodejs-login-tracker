const userDAO = require("./dao/dao");

const authenticateUserByEmail = async (email) => {
  try {
    const user = await userDAO.findByEmail({ email });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createUser = async (data) => {
  try {
    const user = await userDAO.create(data);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateUser = async (data, filter) => {
  try {
    await userDAO.update(data, filter);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  authenticateUserByEmail,
  updateUser,
  createUser,
};
