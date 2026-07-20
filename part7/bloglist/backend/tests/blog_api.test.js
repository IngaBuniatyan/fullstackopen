const { after, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

const resetDatabase = async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(helper.initialUser.password, 10)
  const user = await new User({
    username: helper.initialUser.username,
    name: helper.initialUser.name,
    passwordHash,
  }).save()

  const blogs = await Blog.insertMany(
    helper.initialBlogs.map((blog) => ({ ...blog, user: user._id })),
  )
  user.blogs = blogs.map((blog) => blog._id)
  await user.save()
}

const login = async (
  username = helper.initialUser.username,
  password = helper.initialUser.password,
) => {
  const response = await api.post('/api/login').send({ username, password })
  return response.body.token
}

beforeEach(resetDatabase)

describe('blogs API', () => {
  test('returns blogs with id, creator and comments', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
    assert.ok(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
    assert.strictEqual(response.body[0].user.username, 'root')
    assert.ok(Array.isArray(response.body[0].comments))
  })

  test('creates a blog for the signed-in user', async () => {
    const token = await login()
    const blog = {
      title: 'State management with Zustand',
      author: 'Full Stack Open',
      url: 'https://fullstackopen.com/en/part6',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
    assert.strictEqual(response.body.user.username, 'root')
    assert.strictEqual((await helper.blogsInDb()).length, 3)
  })

  test('rejects blog creation without a token', async () => {
    await api
      .post('/api/blogs')
      .send({ title: 'No token', url: 'https://example.com' })
      .expect(401)
  })

  test('updates likes and preserves creator', async () => {
    const [blog] = (await api.get('/api/blogs')).body
    const response = await api
      .put(`/api/blogs/${blog.id}`)
      .send({ likes: blog.likes + 1 })
      .expect(200)

    assert.strictEqual(response.body.likes, blog.likes + 1)
    assert.strictEqual(response.body.user.username, 'root')
  })

  test('creator can delete a blog', async () => {
    const token = await login()
    const [blog] = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    assert.strictEqual((await helper.blogsInDb()).length, 1)
  })

  test('another user cannot delete a blog', async () => {
    const passwordHash = await bcrypt.hash('other-secret', 10)
    await new User({
      username: 'other',
      name: 'Other User',
      passwordHash,
    }).save()
    const token = await login('other', 'other-secret')
    const [blog] = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
  })
})

describe('comments API', () => {
  test('adds an anonymous comment to a blog', async () => {
    const [blog] = await helper.blogsInDb()
    const response = await api
      .post(`/api/blogs/${blog.id}/comments`)
      .send({ comment: 'This clarified the topic.' })
      .expect(201)

    assert.ok(response.body.comments.includes('This clarified the topic.'))
    assert.strictEqual(response.body.user.username, 'root')
  })

  test('rejects an empty comment', async () => {
    const [blog] = await helper.blogsInDb()
    await api
      .post(`/api/blogs/${blog.id}/comments`)
      .send({ comment: '   ' })
      .expect(400)
  })
})

describe('users API', () => {
  test('returns users with populated blogs', async () => {
    const response = await api.get('/api/users').expect(200)

    assert.strictEqual(response.body.length, 1)
    assert.strictEqual(response.body[0].blogs.length, 2)
    assert.strictEqual(response.body[0].blogs[0].title, 'React patterns')
  })

  test('returns an individual user with their blogs', async () => {
    const [user] = await helper.usersInDb()
    const response = await api.get(`/api/users/${user.id}`).expect(200)

    assert.strictEqual(response.body.username, 'root')
    assert.strictEqual(response.body.blogs.length, 2)
  })
})

after(async () => {
  await mongoose.connection.close()
})
