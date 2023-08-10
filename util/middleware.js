const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const bjwt   = require('../models/bjwt');
const { User }   = require('../models');
const errorHandler = (error, response, next) => {
  const messages = [];
  if (error.name === 'SequelizeValidationError') {
    
    error.errors.forEach((validErrors) => {
      messages.push(validErrors.message);
    });

    response.status(400).json({ error: messages });
  }
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'token expired' });
  }

  next(error);
};

const tokenExtractor = async  (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' });
  }

  const decodedToken = jwt.verify(authorization.substring(7), SECRET);
  //console.log(decodedToken)
  const bJwt = await bjwt.findByPk(decodedToken.jti);

  if (!bJwt) {
    const user = await User.findOne({
      where: {
        username: decodedToken.username,
      },
    });
    req.decodedToken = decodedToken;
    if (!user.enabled) {
      return res.status(401).json({ error: 'user disabled' });
    }
  }else{
    return res.status(401).json({ error: 'invalid token' });
  }
  

  next();
}

module.exports = {
  errorHandler,
  tokenExtractor
};


