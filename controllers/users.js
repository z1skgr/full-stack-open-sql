const usersRouter = require('express').Router();
const bcrypt = require('bcrypt')

const { User } = require('../models');
const { Blog } = require('../models');
const ReadingList = require('../models/reading_list');


usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
    }
  })
  res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  let where = {}
  const user = await User.findByPk(id, {
    where: { id: req.params.userId },
    attributes: ['name', 'username','enabled'],
    where,
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
        
        include: [
          {
            model: ReadingList,
            attributes: ['read', 'id'],
            where: req.query?.read != null
            ? { read: req.query.read }
            : { },
          },
          
        ],
        
      },
      
    ],
    
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: `User with id ${id} not found`});
  }
});


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