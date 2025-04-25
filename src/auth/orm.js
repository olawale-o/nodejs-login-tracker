
const findByEmail = async ({email}) => {
    const isFound = await db.User.findOne({
      where: { email },
    });
  
    if (isFound) {
      return true
    }
    return false
  }
  
  const insertOne = async (credentials) => {
    const user = await db.User.create({
      ...credentials
    });
    if (!user) {
      throw new AppError(
        500,
        "Something went wrong. Could not create user at this time. Please try again later",
      );
    }
    return user;
  }

module.exports = { findByEmail, insertOne }