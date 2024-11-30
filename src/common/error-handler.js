const config = require("../../config");

const handleError = (err, res) => {
  if (config.get("env") !== "test") {
    // sendCriticalErrorNotification()
    console.error(err);
  }

  if (!err.isOperational) {
    console.error("Shutting down the application...");
    process.exit(1);
    // Shut down the application if it's not an AppError
  }
  return res.status(err.statusCode).json({
    message: err.message,
  });
};

module.exports = handleError;
