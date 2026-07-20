import { Link } from 'react-router-dom'

const NotFound = () => (
  <section className="error-page">
    <p className="error-code">404</p>
    <h1>Page not found</h1>
    <p>The address does not match a page in Bloglist.</p>
    <Link className="button-link" to="/">
      Back to blogs
    </Link>
  </section>
)

export default NotFound
