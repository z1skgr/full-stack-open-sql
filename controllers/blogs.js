const blogsRouter = require('express').Router();
const { tokenExtractor } = require('../util/middleware');

const { Blog } = require('../models');
const { User } = require('../models');

const { Op } = require("sequelize");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};


blogsRouter.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where.title = {
      [Op.iLike]: `${req.query.search}%`
    }
  }
  

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['username','name','id']
    },  
    where
  });
  res.json(blogs);
});

blogsRouter.post('/', tokenExtractor, async (req, res) => {
  try{
    //console.log(req)
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id});
    res.json(blog);
  }catch(error){
    console.log(error)
    return res.status(400).json({error})
  }
  
  
});

blogsRouter.delete('/:id', [blogFinder,tokenExtractor], async (req, res) => {

  const user = await User.findByPk(req.decodedToken.id);
  const { blog } = req;

  if (!blog) {
    res.status(404).end();
  } else if (!user || user.id !== blog.userId) {
    res.status(401).json({ error: 'Unathorized user to delete this blog' });
  } else {
    await blog.destroy();
    res.status(204).end();
  }
});

blogsRouter.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.put('/:id', blogFinder, async (req, res) => {
  const { blog } = req;

  //console.log(req.blog)

  if (blog) {
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

module.exports = blogsRouter;