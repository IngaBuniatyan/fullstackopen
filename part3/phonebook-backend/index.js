require('dotenv').config({ quiet: true })

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error(`error connecting to MongoDB: ${error.message}`)
  })

app.use(express.json())

morgan.token('body', (request) =>
  request.method === 'POST' ? JSON.stringify(request.body) : '',
)

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body',
  ),
)

app.use(cors())
app.use(express.static('dist'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch(next)
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(next)
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400).json({
      error: 'name is missing',
    })
  }

  if (!number) {
    return response.status(400).json({
      error: 'number is missing',
    })
  }

  Person.findOne({ name })
    .then((existingPerson) => {
      if (existingPerson) {
        return response.status(400).json({
          error: 'name must be unique',
        })
      }

      const person = new Person({
        name,
        number,
      })

      return person.save().then((savedPerson) => {
        response.json(savedPerson)
      })
    })
    .catch(next)
})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body

  if (!number) {
    return response.status(400).json({
      error: 'number is missing',
    })
  }

  const person = { number }

  return Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, _next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  return response.status(500).send({ error: 'internal server error' })
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
