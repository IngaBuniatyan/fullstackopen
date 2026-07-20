const { after, before, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)
let passwordHash

before(async () => {
  passwordHash = await bcrypt.hash(helper.initialUser.password, 10)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = new User({
    username: helper.initialUser.username,
    name: helper.initialUser.name,
    passwordHash,
  })
  await user.save()
})

describe('user creation', () => {
  test('a valid user can be created', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, newUser.username)
    assert.strictEqual(response.body.password, undefined)
    assert.strictEqual(response.body.passwordHash, undefined)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    assert.ok(
      usersAtEnd.map((user) => user.username).includes(newUser.username),
    )
  })

  test('duplicate username is rejected', async () => {
    const usersAtStart = await helper.usersInDb()
    const duplicateUser = {
      username: helper.initialUser.username,
      name: 'Duplicate Root',
      password: 'another-secret',
    }

    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)

    assert.ok(response.body.error.includes('unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('username shorter than three characters is rejected', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'ab', name: 'Short', password: 'valid-password' })
      .expect(400)

    assert.ok(response.body.error)
  })

  test('missing username is rejected', async () => {
    const response = await api
      .post('/api/users')
      .send({ name: 'Missing Username', password: 'valid-password' })
      .expect(400)

    assert.ok(response.body.error)
  })

  test('password shorter than three characters is rejected', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'shortpass', name: 'Short', password: 'ab' })
      .expect(400)

    assert.ok(response.body.error.includes('password'))
  })

  test('missing password is rejected', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'nopassword', name: 'Missing Password' })
      .expect(400)

    assert.ok(response.body.error.includes('password'))
  })
})

describe('user data and login', () => {
  test('users include their populated blogs', async () => {
    const user = await User.findOne({
      username: helper.initialUser.username,
    })
    const blog = new Blog({
      ...helper.initialBlogs[0],
      user: user._id,
    })
    const savedBlog = await blog.save()
    user.blogs = [savedBlog._id]
    await user.save()

    const response = await api.get('/api/users').expect(200)
    const returnedUser = response.body.find(
      (entry) => entry.username === user.username,
    )

    assert.strictEqual(returnedUser.blogs.length, 1)
    assert.strictEqual(returnedUser.blogs[0].title, blog.title)
  })

  test('login returns token, username and name', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.token)
    assert.strictEqual(
      response.body.username,
      helper.initialUser.username,
    )
    assert.strictEqual(response.body.name, helper.initialUser.name)
  })
})

after(async () => {
  await mongoose.connection.close()
})
