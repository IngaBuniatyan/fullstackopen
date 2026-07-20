import { create } from 'zustand'

import blogService from '../services/blogs'
import userService from '../services/users'

const useBlogStore = create((set, get) => ({
  blogs: [],
  users: [],
  loading: false,

  initializeBlogs: async () => {
    set({ loading: true })
    try {
      const blogs = await blogService.getAll()
      set({ blogs })
    } finally {
      set({ loading: false })
    }
  },

  initializeUsers: async () => {
    const users = await userService.getAll()
    set({ users })
  },

  createBlog: async (blog) => {
    const savedBlog = await blogService.create(blog)
    set({ blogs: get().blogs.concat(savedBlog) })
    await get().initializeUsers()
    return savedBlog
  },

  likeBlog: async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    })
    set({
      blogs: get().blogs.map((item) =>
        item.id === blog.id ? updatedBlog : item,
      ),
    })
    return updatedBlog
  },

  deleteBlog: async (id) => {
    await blogService.remove(id)
    set({ blogs: get().blogs.filter((blog) => blog.id !== id) })
    await get().initializeUsers()
  },

  addComment: async (id, comment) => {
    const updatedBlog = await blogService.addComment(id, comment)
    set({
      blogs: get().blogs.map((blog) => (blog.id === id ? updatedBlog : blog)),
    })
    return updatedBlog
  },
}))

export default useBlogStore
