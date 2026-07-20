import { useNavigate, useParams } from 'react-router-dom'

import useBlogStore from '../stores/blogStore'
import useNotificationStore from '../stores/notificationStore'
import useUserStore from '../stores/userStore'
import Blog from './Blog'
import Comments from './Comments'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const blogs = useBlogStore((state) => state.blogs)
  const likeBlog = useBlogStore((state) => state.likeBlog)
  const deleteBlog = useBlogStore((state) => state.deleteBlog)
  const addComment = useBlogStore((state) => state.addComment)
  const user = useUserStore((state) => state.user)
  const notify = useNotificationStore((state) => state.notify)
  const blog = blogs.find((entry) => entry.id === id)

  if (!blog) {
    return (
      <section className="error-page">
        <h1>Blog not found</h1>
      </section>
    )
  }

  const handleLike = async () => {
    try {
      await likeBlog(blog)
      notify(`You liked ${blog.title}`)
    } catch {
      notify(`Failed to like ${blog.title}`, 'error')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return
    }

    try {
      await deleteBlog(blog.id)
      notify(`Removed blog ${blog.title} by ${blog.author}`)
      navigate('/')
    } catch {
      notify(`Failed to remove ${blog.title}`, 'error')
    }
  }

  const handleComment = async (comment) => {
    if (!comment.trim()) {
      notify('Comment cannot be empty', 'error')
      return false
    }

    try {
      await addComment(blog.id, comment)
      notify('Comment added')
      return true
    } catch {
      notify('Failed to add comment', 'error')
      return false
    }
  }

  return (
    <div>
      <Blog
        blog={blog}
        canDelete={blog.user?.username === user.username}
        onDelete={handleDelete}
        onLike={handleLike}
      />
      <Comments comments={blog.comments} onComment={handleComment} />
    </div>
  )
}

export default BlogView
