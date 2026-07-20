import { useNavigate } from 'react-router-dom'

import { useAnecdotes, useField } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('url')
  const { addAnecdote } = useAnecdotes()
  const navigate = useNavigate()

  const reset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    })
    reset()
    navigate('/')
  }

  return (
    <section>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <label>
          content
          <input aria-label="content" {...content.input} />
        </label>
        <label>
          author
          <input aria-label="author" {...author.input} />
        </label>
        <label>
          url for more info
          <input aria-label="info" {...info.input} />
        </label>
        <div className="form-actions">
          <button type="submit">create</button>
          <button type="button" onClick={reset}>
            reset
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreateNew

