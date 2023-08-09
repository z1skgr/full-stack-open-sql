const readingListsRouter = require('express').Router();

const ReadingList = require('../models/reading_list');



readingListsRouter.post('/', async (req, res) => {

  const { blogId, userId } = req.body;
  const readingList = await ReadingList.create({ blogId, userId });
  res.json(readingList);
});



readingListsRouter.get('/', async (req, res) => {
  const readingList = await ReadingList.findAll();
  res.json(readingList);
});

module.exports = readingListsRouter;