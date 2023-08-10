const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt');

const { SECRET } = require('../util/config')
const User = require('../models/user')

const { v4: uuidv4 } = require('uuid');

loginRouter.post('/', async (req, res ) => {
const body = req.body;

  const user = await User.findOne({
    where: {
      username:body.username
    },
  });

  const passwordCorrect = !body.password
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user&& passwordCorrect)) {
    res.status(401).json({ error: 'invalid username or password' });
  }

  const loginUser = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(loginUser, SECRET,  {
    expiresIn: '1d',
    jwtid: uuidv4(),
  });

  res.status(200).json({ token, ...loginUser });
})

module.exports = loginRouter