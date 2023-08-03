const errorHandler = (error, request, response, next) => {
  console.error(error);

  if (error.name === 'SequelizeValidationError') {
    response.status(400).json(error);
  }

  next(error);
};

module.exports = {
  errorHandler,
};
