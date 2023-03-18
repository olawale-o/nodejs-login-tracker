const transformResponse = (obj) => {
  const { data = {}, statusCode, res, message = 'Success' } = obj;
  return res.status(statusCode).json({
    message,
    data,
  });
};

module.exports = transformResponse;