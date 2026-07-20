import { useNavigate } from 'react-router-dom'

import useBlogStore from '../stores/blogStore'
import useNotificationStore from '../stores/notificationStore'
import BlogForm from './BlogForm'

const CreateBlogView = () => {
  const createBlog = useBlogStore((state) => state.createBlog)
  const notify = useNotificationStore((state) => state.notify)
  const navigate = useNavigate()

  const handleCreate = async (blog) => {
    try {
      const savedBlog = await createBlog(blog)
      notify(`A new blog ${savedBlog.title} by ${savedBlog.author} added`)
      navigate('/')
      return true
    } catch (error) {
      notify(error.response?.data?.error || 'Failed to create blog', 'error')
      return false
    }
  }

  return (
    <section className="panel">
      <h1>Create a new blog</h1>
      <BlogForm onCreate={handleCreate} />
    </section>
  )
}

export default CreateBlogView
