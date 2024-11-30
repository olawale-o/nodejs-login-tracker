const moment = require("moment");
const db = require("../models");
const AppError = require("../common/app-error");

const IDLE_TIMEOUT = 1 * 60 * 1000;

const sessionExpired = async (req, _res, next) => {
  const data = req.data;

  const user = await db.User.findOne({
    where: { id: data.id },
  });

  const now = moment();
  const idleTime = now - user.lastActivity;
  try {
    if (idleTime > IDLE_TIMEOUT) {
      throw new AppError(401, "Session expired due to inactivity1");
    }
    await db.User.update(
      {
        lastActivity: now,
      },
      { where: { id: data.id } },
    );
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = sessionExpired;
