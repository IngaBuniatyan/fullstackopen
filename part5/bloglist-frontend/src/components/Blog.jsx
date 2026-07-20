import { useState } from 'react'

const Blog = ({
  blog,
  canDelete,
  canLike = true,
  detailsVisibleInitially = false,
  onDelete,
  onLike,
  showToggle = true,
}) => {
  const [detailsVisible, setDetailsVisible] = useState(
    detailsVisibleInitially,
  )

  const creator = blog.user?.name || blog.user?.username || ''

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        {showToggle && (
          <button
            type="button"
            onClick={() => setDetailsVisible(!detailsVisible)}
          >
            {detailsVisible ? 'hide' : 'view'}
          </button>
        )}
      </div>

      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            {canLike && (
              <button type="button" onClick={() => onLike(blog)}>
                like
              </button>
            )}
          </div>
          <div>{creator}</div>
          {canDelete && (
            <button type="button" onClick={() => onDelete(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
