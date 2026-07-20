import { useNotificationStore } from '../notificationStore'
import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()
  const notify = useNotificationStore((state) => state.notify)

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()

    if (!content) {
      return
    }

    await create(content)
    notify(`you created '${content}'`)
    event.target.reset()
  }

  return (
    <form onSubmit={addAnecdote}>
      <h2>create new</h2>
      <input aria-label="anecdote" name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
