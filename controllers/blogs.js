const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog } = require('../models');
const { User } = require('../models');

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

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  });
  res.json(blogs);
});

blogsRouter.post('/', tokenExtractor, async (req, res) => {
  try{
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id});
    res.json(blog);
  }catch(error){
    console.log(error)
    return res.status(400).json({error})
  }
  
  
});

blogsRouter.delete('/:id', blogFinder, async (req, res) => {
  const { blog } = req;

  if (blog) {
    
    await req.blog.destroy()
    res.status(204).end();
  } else {
    res.status(404).end();
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

  console.log(req.blog)

  if (blog) {
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

module.exports = blogsRouter;