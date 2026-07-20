import { afterEach, describe, expect, test, vi } from 'vitest'

import anecdoteService from './anecdotes'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('anecdote service', () => {
  test('loads anecdotes with the Fetch API', async () => {
    const anecdotes = [{ id: '1', content: 'Test anecdote' }]
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => anecdotes,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(anecdoteService.getAll()).resolves.toEqual(anecdotes)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/anecdotes',
      undefined,
    )
  })

  test('deletes an anecdote from the server', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    })
    vi.stubGlobal('fetch', fetchMock)

    await anecdoteService.remove('2')
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/anecdotes/2',
      { method: 'DELETE' },
    )
  })
})
