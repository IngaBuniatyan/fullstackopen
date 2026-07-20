import { useNotify } from '../NotificationContext'
import { useAnecdotes } from '../hooks/useAnecdotes'

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdotes()
  const notify = useNotify()

  const create = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()

    try {
      await createAnecdote(content)
      notify(`anecdote '${content}' created`)
      event.target.reset()
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  return (
    <form onSubmit={create}>
      <h2>create new</h2>
      <input aria-label="anecdote" name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
