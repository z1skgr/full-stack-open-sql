const logoutRouter = require('express').Router();
const { tokenExtractor } = require('../util/middleware');

const bjwt   = require('../models/bjwt');

logoutRouter.post('/', tokenExtractor, async (req, res) => {
  const uuid = req.decodedToken.jti;

  const bljwt = await bjwt.create({ id: uuid });

  res.json(bljwt);
});

module.exports = logoutRouter;