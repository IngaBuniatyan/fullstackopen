require('dotenv').config({ quiet: true })

const mongoose = require('mongoose')
const Person = require('./models/person')

const password = process.argv[2]

if (!password) {
  console.log('give password as argument')
  process.exit(1)
}

const createConnectionString = (uri, suppliedPassword) => {
  const schemeEnd = uri.indexOf('://') + 3
  const passwordStart = uri.indexOf(':', schemeEnd) + 1
  const credentialsEnd = uri.indexOf('@', passwordStart)

  if (schemeEnd < 3 || passwordStart === 0 || credentialsEnd === -1) {
    throw new Error('MONGODB_URI has an invalid format')
  }

  return `${uri.slice(0, passwordStart)}${encodeURIComponent(suppliedPassword)}${uri.slice(credentialsEnd)}`
}

const main = async () => {
  const url = createConnectionString(process.env.MONGODB_URI, password)

  mongoose.set('strictQuery', false)
  await mongoose.connect(url)

  if (process.argv.length === 3) {
    const persons = await Person.find({})

    console.log('phonebook:')
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
  } else if (process.argv.length === 5) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    await person.save()
    console.log(
      `added ${person.name} number ${person.number} to phonebook`,
    )
  } else {
    console.log('usage: node mongo.js <password> [name number]')
    process.exitCode = 1
  }
}

main()
  .catch((error) => {
    console.error(`operation failed: ${error.message}`)
    process.exitCode = 1
  })
  .finally(() => mongoose.connection.close())
