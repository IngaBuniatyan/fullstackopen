import { Link } from 'react-router-dom'

import { useAnecdotes } from '../hooks'

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()

  return (
    <section>
      <h2>Anecdotes</h2>
      <ul className="anecdote-list">
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            <Link to={`/anecdotes/${anecdote.id}`}>
              {anecdote.content}
            </Link>
            <button
              type="button"
              onClick={() => deleteAnecdote(anecdote.id)}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AnecdoteList

