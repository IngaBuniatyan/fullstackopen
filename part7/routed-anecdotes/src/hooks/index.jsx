import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import anecdoteService from '../services/anecdotes'

const AnecdotesContext = createContext(null)

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => setValue(event.target.value)
  const reset = () => setValue('')

  return {
    input: { type, value, onChange },
    reset,
    value,
  }
}

export const AnecdotesProvider = ({ children }) => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(setAnecdotes)
  }, [])

  const value = useMemo(
    () => ({
      anecdotes,
      addAnecdote: async (anecdote) => {
        const savedAnecdote = await anecdoteService.create(anecdote)
        setAnecdotes((current) => current.concat(savedAnecdote))
        return savedAnecdote
      },
      deleteAnecdote: async (id) => {
        await anecdoteService.remove(id)
        setAnecdotes((current) =>
          current.filter((anecdote) => anecdote.id !== id),
        )
      },
    }),
    [anecdotes],
  )

  return (
    <AnecdotesContext.Provider value={value}>
      {children}
    </AnecdotesContext.Provider>
  )
}

export const useAnecdotes = () => {
  const context = useContext(AnecdotesContext)

  if (!context) {
    throw new Error('useAnecdotes must be used inside AnecdotesProvider')
  }

  return context
}

