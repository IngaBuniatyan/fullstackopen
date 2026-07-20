const baseUrl = 'http://localhost:3001/anecdotes'

const request = async (url, options) => {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error('anecdote request failed')
  }

  return response.status === 204 ? null : response.json()
}

export const getAll = () => request(baseUrl)

export const create = (content) =>
  request(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })

export const update = (anecdote) =>
  request(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })

export const remove = (id) =>
  request(`${baseUrl}/${id}`, { method: 'DELETE' })
