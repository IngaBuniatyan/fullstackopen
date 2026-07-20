import useField from '../hooks/useField'

const Comments = ({ comments = [], onComment }) => {
  const comment = useField()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const added = await onComment(comment.value)
    if (added) {
      comment.reset()
    }
  }

  return (
    <section className="comments">
      <h2>Comments</h2>
      <form className="comment-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="comment">
          New comment
        </label>
        <input
          id="comment"
          aria-label="comment"
          placeholder="Share a thought"
          {...comment.input}
        />
        <button className="primary" type="submit">
          add comment
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="muted">No comments yet.</p>
      ) : (
        <ul>
          {comments.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Comments
