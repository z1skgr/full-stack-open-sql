const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const errorHandler = (error, response, next) => {
  const messages = [];
  if (error.name === 'SequelizeValidationError') {
    
    error.errors.forEach((validErrors) => {
      messages.push(validErrors.message);
    });

    response.status(400).json({ error: messages });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor
};


