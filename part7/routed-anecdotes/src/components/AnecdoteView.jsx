import { Navigate, useParams } from 'react-router-dom'

import { useAnecdotes } from '../hooks'

const AnecdoteView = () => {
  const { id } = useParams()
  const { anecdotes } = useAnecdotes()
  const anecdote = anecdotes.find((item) => item.id === id)

  if (!anecdote) {
    return anecdotes.length === 0 ? <p>Loading...</p> : <Navigate to="/" />
  }

  return (
    <article className="anecdote">
      <h2>{anecdote.content}</h2>
      <p>by {anecdote.author}</p>
      <p>
        has {anecdote.votes} votes, for more info see{' '}
        <a href={anecdote.info}>{anecdote.info}</a>
      </p>
    </article>
  )
}

export default AnecdoteView

