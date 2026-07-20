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

  const blogs = await Blog.insertMany(
    helper.initialBlogs.map((blog) => ({
      ...blog,
      user: user._id,
    })),
  )

  user.blogs = blogs.map((blog) => blog._id)
  await user.save()
})

const loginAsInitialUser = async () => {
  const response = await api.post('/api/login').send({
    username: helper.initialUser.username,
    password: helper.initialUser.password,
  })
  return response.body.token
}

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  test('blogs contain the username and name of their creator', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      assert.strictEqual(blog.user.username, helper.initialUser.username)
      assert.strictEqual(blog.user.name, helper.initialUser.name)
    })
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const token = await loginAsInitialUser()
    const newBlog = {
      title: 'Async/await simplifies making async calls',
      author: 'Full Stack Open',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend',
      likes: 8,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, newBlog.title)
    assert.strictEqual(response.body.author, newBlog.author)
    assert.strictEqual(response.body.url, newBlog.url)
    assert.strictEqual(response.body.likes, newBlog.likes)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(
      blogsAtEnd.length,
      helper.initialBlogs.length + 1,
    )
    assert.ok(blogsAtEnd.map((blog) => blog.title).includes(newBlog.title))
  })

  test('likes defaults to zero if the property is missing', async () => {
    const token = await loginAsInitialUser()
    const newBlog = {
      title: 'A blog without likes',
      author: 'Test Author',
      url: 'https://example.com/no-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('a blog without a title is rejected', async () => {
    const token = await loginAsInitialUser()
    const newBlog = {
      author: 'Test Author',
      url: 'https://example.com/no-title',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a blog without a url is rejected', async () => {
    const token = await loginAsInitialUser()
    const newBlog = {
      title: 'A blog without a URL',
      author: 'Test Author',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a blog cannot be added without a token', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'Unknown',
      url: 'https://example.com/unauthorized',
      likes: 1,
    }

    await api.post('/api/blogs').send(newBlog).expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a blog cannot be added with an invalid token', async () => {
    const newBlog = {
      title: 'Invalid token blog',
      author: 'Unknown',
      url: 'https://example.com/invalid-token',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer invalid-token')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('a blog can be deleted by its creator', async () => {
    const token = await loginAsInitialUser()
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    assert.ok(
      !blogsAtEnd.map((blog) => blog.title).includes(blogToDelete.title),
    )
  })

  test('a blog cannot be deleted by another user', async () => {
    const otherUser = new User({
      username: 'otheruser',
      name: 'Other User',
      passwordHash,
    })
    await otherUser.save()

    const loginResponse = await api.post('/api/login').send({
      username: otherUser.username,
      password: helper.initialUser.password,
    })
    const blogsAtStart = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogsAtStart[0].id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('updating a blog', () => {
  test('the number of likes can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedLikes = blogToUpdate.likes + 5

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, updatedLikes)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id,
    )
    assert.strictEqual(updatedBlog.likes, updatedLikes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
