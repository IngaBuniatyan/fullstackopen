import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import BlogForm from './BlogForm'

test('submitting the form calls the handler with the correct data', async () => {
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
})
