const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(password || '', user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response
        .status(401)
        .json({ error: 'invalid username or password' })
    }

    const token = jwt.sign(
      { username: user.username, id: user._id },
      config.SECRET,
    )
    return response.json({
      token,
      username: user.username,
      name: user.name,
      id: user.id,
    })
  } catch (error) {
    return next(error)
  }
})

module.exports = loginRouter
