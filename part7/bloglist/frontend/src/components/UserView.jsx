import { Link, useParams } from 'react-router-dom'

import useBlogStore from '../stores/blogStore'

const UserView = () => {
  const { id } = useParams()
  const users = useBlogStore((state) => state.users)
  const user = users.find((entry) => entry.id === id)

  if (!user) {
    return (
      <section className="error-page">
        <h1>User not found</h1>
      </section>
    )
  }

  return (
    <section>
      <p className="eyebrow">@{user.username}</p>
      <h1>{user.name || user.username}</h1>
      <h2>Added blogs</h2>
      {user.blogs.length === 0 ? (
        <p className="muted">This user has not added any blogs.</p>
      ) : (
        <ul className="user-blogs">
          {user.blogs.map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              <span>{blog.likes} likes</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default UserView
