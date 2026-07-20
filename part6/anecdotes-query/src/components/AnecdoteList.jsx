import { useNotify } from '../NotificationContext'
import { useAnecdotes } from '../hooks/useAnecdotes'

const AnecdoteList = () => {
  const { anecdotes, voteAnecdote } = useAnecdotes()
  const notify = useNotify()

  const vote = async (anecdote) => {
    await voteAnecdote({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
    notify(`you voted '${anecdote.content}'`)
  }

  return (
    <div>
      {anecdotes
        .toSorted((first, second) => second.votes - first.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}{' '}
              <button type="button" onClick={() => vote(anecdote)}>
                vote
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default AnecdoteList
