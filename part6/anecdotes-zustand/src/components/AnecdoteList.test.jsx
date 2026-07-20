import { render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'

import { useAnecdoteStore } from '../store'
import AnecdoteList from './AnecdoteList'

const anecdotes = [
  { id: '1', content: 'low votes', votes: 1 },
  { id: '2', content: 'high votes', votes: 5 },
  { id: '3', content: 'filtered text', votes: 2 },
]

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes, filter: '' })
})

test('renders anecdotes sorted by votes', () => {
  render(<AnecdoteList />)
  const rendered = screen.getAllByTestId('anecdote')

  expect(rendered[0]).toHaveTextContent('high votes')
  expect(rendered[1]).toHaveTextContent('filtered text')
  expect(rendered[2]).toHaveTextContent('low votes')
})

test('filtering renders only matching anecdotes', () => {
  useAnecdoteStore.setState({ filter: 'filtered' })
  render(<AnecdoteList />)

  expect(screen.getAllByTestId('anecdote')).toHaveLength(1)
  expect(screen.getByText('filtered text')).toBeVisible()
})
