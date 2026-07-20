import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const { isError, isPending } = useAnecdotes()

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  return (
    <div>
      <h1>Anecdotes</h1>
      <Notification />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
