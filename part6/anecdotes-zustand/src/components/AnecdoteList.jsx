import { useNotificationStore } from '../notificationStore'
import {
  useAnecdoteActions,
  useAnecdotes,
  useFilter,
} from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter().toLowerCase()
  const { remove, vote } = useAnecdoteActions()
  const notify = useNotificationStore((state) => state.notify)

  const visibleAnecdotes = anecdotes
    .filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter),
    )
    .toSorted((first, second) => second.votes - first.votes)

  const voteFor = async (anecdote) => {
    await vote(anecdote.id)
    notify(`you voted '${anecdote.content}'`)
  }

  return (
    <div>
      {visibleAnecdotes.map((anecdote) => (
        <div data-testid="anecdote" key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}{' '}
            <button type="button" onClick={() => voteFor(anecdote)}>
              vote
            </button>
            {anecdote.votes === 0 && (
              <button
                type="button"
                onClick={() => remove(anecdote.id)}
              >
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
