const usersRouter = require('express').Router();
const bcrypt = require('bcrypt')

const { User } = require('../models');
const { Blog } = require('../models');

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    name,
    username,
    passwordHash,
  });

  res.status(201).json(user)
})


usersRouter.put('/:username', async (req, res) => {

  const { username } = req.params;
  
  const user = await User.findOne({
    where: {
      username,
    },
  });
  

  if(user){
    const usern=req.body.username
    //console.log(usern)
    const updatedUser = await user.update({ username: usern });
    res.json(updatedUser);
  }else{
    res.status(404).end();
  }

});

module.exports = usersRouter