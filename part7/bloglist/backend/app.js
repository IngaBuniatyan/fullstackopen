const cors = require('cors')
const express = require('express')
const fs = require('node:fs')
const mongoose = require('mongoose')
const path = require('node:path')

const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const usersRouter = require('./controllers/users')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()
const frontendDist = path.resolve(__dirname, '../frontend/dist')

mongoose.set('strictQuery', false)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

app.use(express.static(frontendDist))

if (fs.existsSync(path.join(frontendDist, 'index.html'))) {
  app.get('/{*splat}', (request, response, next) => {
    if (request.path.startsWith('/api/')) {
      return next()
    }
    return response.sendFile(path.join(frontendDist, 'index.html'))
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
