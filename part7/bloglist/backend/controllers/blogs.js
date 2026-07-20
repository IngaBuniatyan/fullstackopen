const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

const populateUser = {
  path: 'user',
  select: 'username name',
}

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate(populateUser)
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate(populateUser)
    return blog ? response.json(blog) : response.status(404).end()
  } catch (error) {
    return next(error)
  }
})

blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user
      const { title, author, url, likes } = request.body
      const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: user._id,
      })
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      await savedBlog.populate(populateUser)
      response.status(201).json(savedBlog)
    } catch (error) {
      next(error)
    }
  },
)

blogsRouter.post('/:id/comments', async (request, response, next) => {
  try {
    const comment = request.body.comment?.trim()
    if (!comment) {
      return response.status(400).json({ error: 'comment is required' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }

    blog.comments = blog.comments.concat(comment)
    const updatedBlog = await blog.save()
    await updatedBlog.populate(populateUser)
    return response.status(201).json(updatedBlog)
  } catch (error) {
    return next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const allowedUpdate = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
    }
    Object.keys(allowedUpdate).forEach((key) => {
      if (allowedUpdate[key] === undefined) {
        delete allowedUpdate[key]
      }
    })

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      allowedUpdate,
      { returnDocument: 'after', runValidators: true },
    ).populate(populateUser)

    return updatedBlog ? response.json(updatedBlog) : response.status(404).end()
  } catch (error) {
    return next(error)
  }
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const blog = await Blog.findById(request.params.id)
      if (!blog) {
        return response.status(204).end()
      }
      if (!blog.user || blog.user.toString() !== request.user.id) {
        return response
          .status(403)
          .json({ error: 'only the creator can delete this blog' })
      }

      await Blog.findByIdAndDelete(request.params.id)
      request.user.blogs = request.user.blogs.filter(
        (blogId) => blogId.toString() !== blog.id,
      )
      await request.user.save()
      return response.status(204).end()
    } catch (error) {
      return next(error)
    }
  },
)

module.exports = blogsRouter
