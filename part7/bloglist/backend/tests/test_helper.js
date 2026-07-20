const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    comments: ['A useful overview'],
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/goto',
    likes: 5,
    comments: [],
  },
]

const initialUser = {
  username: 'root',
  name: 'Superuser',
  password: 'sekret',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  blogsInDb,
  initialBlogs,
  initialUser,
  usersInDb,
}
