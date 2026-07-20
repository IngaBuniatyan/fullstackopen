import { beforeEach, describe, expect, test, vi } from 'vitest'

import { useAnecdoteStore } from './store'

const initial = [
  { id: '1', content: 'first anecdote', votes: 1 },
  { id: '2', content: 'second anecdote', votes: 3 },
]

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  global.fetch = vi.fn()
})

describe('anecdote store', () => {
  test('initializes with anecdotes returned by the backend', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => initial,
    })

    await useAnecdoteStore.getState().actions.initialize()

    expect(useAnecdoteStore.getState().anecdotes).toEqual(initial)
  })

  test('voting increases votes', async () => {
    useAnecdoteStore.setState({ anecdotes: initial })
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...initial[0], votes: 2 }),
    })

    await useAnecdoteStore.getState().actions.vote('1')

    expect(
      useAnecdoteStore
        .getState()
        .anecdotes.find((anecdote) => anecdote.id === '1').votes,
    ).toBe(2)
  })
})
