import useField from '../hooks/useField'

const BlogForm = ({ onCreate }) => {
  const title = useField()
  const author = useField()
  const url = useField('url')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const created = await onCreate({
      title: title.value,
      author: author.value,
      url: url.value,
    })

    if (created) {
      title.reset()
      author.reset()
      url.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input aria-label="title" {...title.input} />
      </label>
      <label>
        Author
        <input aria-label="author" {...author.input} />
      </label>
      <label>
        URL
        <input aria-label="url" {...url.input} />
      </label>
      <button className="primary" type="submit">
        create
      </button>
    </form>
  )
}

export default BlogForm
