import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import Blog from './Blog'

const blog = {
  id: '1',
  title: 'Testing React components',
  author: 'Test Author',
  url: 'https://example.com/testing-react',
  likes: 5,
  comments: [],
  user: {
    username: 'testuser',
    name: 'Test User',
  },
}

describe('Blog', () => {
  test('shows blog details and allows liking', async () => {
    const user = userEvent.setup()
    const onLike = vi.fn()
    render(
      <Blog blog={blog} canDelete={false} onDelete={vi.fn()} onLike={onLike} />,
    )

    expect(screen.getByRole('heading', { name: blog.title })).toBeVisible()
    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()

    await user.click(screen.getByRole('button', { name: 'like' }))
    expect(onLike).toHaveBeenCalledWith(blog)
  })

  test('shows remove only for the creator', () => {
    render(<Blog blog={blog} canDelete onDelete={vi.fn()} onLike={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
  })
})
