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
  user: {
    username: 'testuser',
    name: 'Test User',
  },
}

describe('Blog', () => {
  test('shows only title and author by default', () => {
    render(
      <Blog
        blog={blog}
        canDelete={false}
        onDelete={vi.fn()}
        onLike={vi.fn()}
      />,
    )

    expect(screen.getByText(blog.title, { exact: false })).toBeVisible()
    expect(screen.getByText(blog.author, { exact: false })).toBeVisible()
    expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
    expect(
      screen.queryByText(`likes ${blog.likes}`),
    ).not.toBeInTheDocument()
  })

  test('shows url and likes after view is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Blog
        blog={blog}
        canDelete={false}
        onDelete={vi.fn()}
        onLike={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'view' }))

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeVisible()
  })

  test('calls the like handler twice when like is clicked twice', async () => {
    const user = userEvent.setup()
    const onLike = vi.fn()
    render(
      <Blog
        blog={blog}
        canDelete={false}
        onDelete={vi.fn()}
        onLike={onLike}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'view' }))
    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(onLike).toHaveBeenCalledTimes(2)
  })

  test('a non-creator sees like but not remove', () => {
    render(
      <Blog
        blog={blog}
        canDelete={false}
        canLike
        detailsVisibleInitially
        onDelete={vi.fn()}
        onLike={vi.fn()}
        showToggle={false}
      />,
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument()
  })

  test('the creator sees the remove button', () => {
    render(
      <Blog
        blog={blog}
        canDelete
        canLike
        detailsVisibleInitially
        onDelete={vi.fn()}
        onLike={vi.fn()}
        showToggle={false}
      />,
    )

    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
  })
})
