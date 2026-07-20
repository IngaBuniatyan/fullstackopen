import { useAnecdoteActions, useFilter } from '../store'

const Filter = () => {
  const filter = useFilter()
  const { setFilter } = useAnecdoteActions()

  return (
    <div>
      filter{' '}
      <input
        aria-label="filter"
        value={filter}
        onChange={({ target }) => setFilter(target.value)}
      />
    </div>
  )
}

export default Filter
