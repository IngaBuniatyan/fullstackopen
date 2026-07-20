const Blog = ({ blog, canDelete, onDelete, onLike }) => {
  const creator = blog.user?.name || blog.user?.username || 'Unknown user'

  return (
    <article className="blog-detail">
      <p className="eyebrow">{blog.author || 'Unknown author'}</p>
      <h1>{blog.title}</h1>
      <a href={blog.url} rel="noreferrer" target="_blank">
        {blog.url}
      </a>
      <div className="detail-actions">
        <span>
          <strong>{blog.likes}</strong> likes
        </span>
        <button type="button" onClick={() => onLike(blog)}>
          like
        </button>
        {canDelete && (
          <button
            className="danger"
            type="button"
            onClick={() => onDelete(blog)}
          >
            remove
          </button>
        )}
      </div>
      <p>
        Added by <strong>{creator}</strong>
      </p>
    </article>
  )
}

export default Blog
