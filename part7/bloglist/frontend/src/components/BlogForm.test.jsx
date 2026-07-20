import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import BlogForm from './BlogForm'

test('submits the title, author and url and resets fields', async () => {
  const user = userEvent.setup()
  const onCreate = vi.fn().mockResolvedValue(true)
  render(<BlogForm onCreate={onCreate} />)

  await user.type(screen.getByLabelText('title'), 'A test blog')
  await user.type(screen.getByLabelText('author'), 'Test Author')
  await user.type(screen.getByLabelText('url'), 'https://example.com/blog')
  await user.click(screen.getByRole('button', { name: 'create' }))

  await waitFor(() => {
    expect(onCreate).toHaveBeenCalledWith({
      title: 'A test blog',
      author: 'Test Author',
      url: 'https://example.com/blog',
    })
  })

  expect(screen.getByLabelText('title')).toHaveValue('')
  expect(screen.getByLabelText('author')).toHaveValue('')
  expect(screen.getByLabelText('url')).toHaveValue('')
})
