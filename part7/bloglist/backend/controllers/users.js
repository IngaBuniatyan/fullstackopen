const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
      comments: 1,
    })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
      comments: 1,
    })
    return user ? response.json(user) : response.status(404).end()
  } catch (error) {
    return next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body
    if (!password || password.length < 3) {
      return response
        .status(400)
        .json({ error: 'password must be at least 3 characters long' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const savedUser = await new User({
      username,
      name,
      passwordHash,
    }).save()
    return response.status(201).json(savedUser)
  } catch (error) {
    return next(error)
  }
})

module.exports = usersRouter
