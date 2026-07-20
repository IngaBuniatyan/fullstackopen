import { useEffect, useRef, useState } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const storageKey = 'loggedBloglistUser'

const ProtectedRoute = ({ user, children }) =>
  user ? children : <Navigate to="/login" replace />

const BlogList = ({ blogs }) => (
  <div>
    <h1>blogs</h1>
    {[...blogs]
      .sort((first, second) => second.likes - first.likes)
      .map((blog) => (
        <div className="blog-list-item" key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </div>
      ))}
  </div>
)

const BlogView = ({ blogs, onDelete, onLike, user }) => {
  const { id } = useParams()
  const blog = blogs.find((entry) => entry.id === id)

  if (!blog) {
    return <p>blog not found</p>
  }

  return (
    <Blog
      blog={blog}
      canDelete={blog.user?.username === user.username}
      canLike
      detailsVisibleInitially
      onDelete={onDelete}
      onLike={onLike}
      showToggle={false}
    />
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const notificationTimeout = useRef(null)
  const navigate = useNavigate()

  const showNotification = (message, type) => {
    if (notificationTimeout.current) {
      window.clearTimeout(notificationTimeout.current)
    }

    setNotification({ message, type })
    notificationTimeout.current = window.setTimeout(() => {
      setNotification(null)
      notificationTimeout.current = null
    }, 5000)
  }

  useEffect(() => {
    blogService
      .getAll()
      .then((initialBlogs) => {
        setBlogs(initialBlogs)
      })
      .catch(() => {
        showNotification('Failed to load blogs', 'error')
      })
  }, [])

  useEffect(() => {
    const storedUser = window.localStorage.getItem(storageKey)

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        blogService.setToken(parsedUser.token)
      } catch {
        window.localStorage.removeItem(storageKey)
      }
    }

    return () => {
      if (notificationTimeout.current) {
        window.clearTimeout(notificationTimeout.current)
      }
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const loggedInUser = await loginService.login(credentials)

      window.localStorage.setItem(
        storageKey,
        JSON.stringify(loggedInUser),
      )
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      navigate('/')
    } catch {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(storageKey)
    blogService.setToken(null)
    setUser(null)
    navigate('/login')
  }

  const createBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)
      const blogWithUser = {
        ...createdBlog,
        user: {
          username: user.username,
          name: user.name,
        },
      }

      setBlogs((currentBlogs) => currentBlogs.concat(blogWithUser))
      showNotification(
        `A new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success',
      )
      navigate('/')
      return true
    } catch {
      showNotification('Failed to create blog', 'error')
      return false
    }
  }

  const likeBlog = async (blog) => {
    if (!user) {
      return
    }

    try {
      const updatedBlog = await blogService.update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
      })
      const blogWithUser = {
        ...updatedBlog,
        user: blog.user,
      }

      setBlogs((currentBlogs) =>
        currentBlogs.map((currentBlog) =>
          currentBlog.id === blog.id ? blogWithUser : currentBlog,
        ),
      )
    } catch {
      showNotification(`Failed to like ${blog.title}`, 'error')
    }
  }

  const deleteBlog = async (blog) => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    )

    if (!confirmed) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs((currentBlogs) =>
        currentBlogs.filter(
          (currentBlog) => currentBlog.id !== blog.id,
        ),
      )
      showNotification(
        `Removed blog ${blog.title} by ${blog.author}`,
        'success',
      )
      navigate('/')
    } catch {
      showNotification(`Failed to remove ${blog.title}`, 'error')
    }
  }

  return (
    <main>
      {user && (
        <nav>
          <Link to="/">blogs</Link>{' '}
          <Link to="/create">create</Link>{' '}
          {user.name} logged in{' '}
          <button type="button" onClick={handleLogout}>
            logout
          </button>
        </nav>
      )}

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <BlogList blogs={blogs} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoute user={user}>
              <BlogView
                blogs={blogs}
                onDelete={deleteBlog}
                onLike={likeBlog}
                user={user}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute user={user}>
              <BlogForm onCreate={createBlog} />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={user ? '/' : '/login'} replace />}
        />
      </Routes>
    </main>
  )
}

export default App
