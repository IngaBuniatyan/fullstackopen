import { Link } from 'react-router-dom'

import useBlogStore from '../stores/blogStore'

const BlogList = () => {
  const blogs = useBlogStore((state) => state.blogs)
  const loading = useBlogStore((state) => state.loading)
  const sortedBlogs = [...blogs].sort(
    (first, second) => second.likes - first.likes,
  )

  if (loading && blogs.length === 0) {
    return <p>Loading blogs...</p>
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Community reading list</p>
          <h1>Blogs</h1>
        </div>
        <Link className="button-link" to="/create">
          Add blog
        </Link>
      </div>

      <div className="blog-grid">
        {sortedBlogs.map((blog) => (
          <article className="blog-card" key={blog.id}>
            <div>
              <p className="blog-author">{blog.author || 'Unknown author'}</p>
              <h2>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </h2>
            </div>
            <div className="blog-meta">
              <span>{blog.likes} likes</span>
              <span>{blog.comments?.length || 0} comments</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogList
