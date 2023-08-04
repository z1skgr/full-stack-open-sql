const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt');

const { SECRET } = require('../util/config')
const User = require('../models/user')

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

  const token = jwt.sign(loginUser, SECRET);

  res.status(200).json({ token, ...loginUser });
})

module.exports = loginRouter