import { expect, test } from '@playwright/test'

import { createBlog, loginWith } from './helper'

const apiUrl = 'http://127.0.0.1:3003/api'
const creator = {
  username: 'testuser',
  name: 'Test User',
  password: 'secret',
}
const otherUser = {
  username: 'otheruser',
  name: 'Other User',
  password: 'secret',
}

test.beforeEach(async ({ page, request }) => {
  await request.post(`${apiUrl}/testing/reset`)
  await request.post(`${apiUrl}/users`, { data: creator })
  await request.post(`${apiUrl}/users`, { data: otherUser })
  await page.goto('/')
})

test('login form is shown by default', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'log in to application' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
})

test.describe('login', () => {
  test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, creator.username, creator.password)

    await expect(
      page.getByText(`${creator.name} logged in`),
    ).toBeVisible()
  })

  test('fails with wrong credentials', async ({ page }) => {
    await loginWith(page, creator.username, 'wrong-password')

    await expect(
      page.getByText('Wrong username or password'),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'log in to application' }),
    ).toBeVisible()
  })
})

test.describe('when logged in', () => {
  test.beforeEach(async ({ page }) => {
    await loginWith(page, creator.username, creator.password)
  })

  test('a blog can be created', async ({ page }) => {
    await createBlog(
      page,
      'A blog created by Playwright',
      'Playwright Author',
      'https://example.com/playwright',
    )

    await expect(
      page
        .locator('.blog-list-item')
        .filter({ hasText: 'A blog created by Playwright' }),
    ).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    const title = 'A blog to like'
    await createBlog(
      page,
      title,
      'Like Author',
      'https://example.com/like',
    )
    await page
      .locator('.blog-list-item')
      .filter({ hasText: title })
      .getByRole('link')
      .click()
    const blog = page.locator('.blog').filter({ hasText: title })

    await expect(blog).toContainText('likes 0')
    await blog.getByRole('button', { name: 'like' }).click()
    await expect(blog).toContainText('likes 1')
  })

  test('the creator can delete a blog', async ({ page }) => {
    const title = 'A removable blog'
    const author = 'Delete Author'
    await createBlog(
      page,
      title,
      author,
      'https://example.com/remove',
    )
    await page
      .locator('.blog-list-item')
      .filter({ hasText: title })
      .getByRole('link')
      .click()
    const blog = page.locator('.blog').filter({ hasText: title })

    page.once('dialog', (dialog) => {
      expect(dialog.message()).toBe(`Remove blog ${title} by ${author}`)
      return dialog.accept()
    })
    await blog.getByRole('button', { name: 'remove' }).click()

    await expect(blog).toHaveCount(0)
    await expect(
      page.getByText(`Removed blog ${title} by ${author}`),
    ).toBeVisible()
  })

  test('only the creator sees the remove button', async ({ page }) => {
    const title = 'Creator-only blog'
    await createBlog(
      page,
      title,
      'Creator',
      'https://example.com/creator-only',
    )
    await page
      .locator('.blog-list-item')
      .filter({ hasText: title })
      .getByRole('link')
      .click()
    let blog = page.locator('.blog').filter({ hasText: title })
    await expect(
      blog.getByRole('button', { name: 'remove' }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'logout' }).click()
    await loginWith(page, otherUser.username, otherUser.password)

    await page
      .locator('.blog-list-item')
      .filter({ hasText: title })
      .getByRole('link')
      .click()
    blog = page.locator('.blog').filter({ hasText: title })
    await expect(blog.getByRole('button', { name: 'like' })).toBeVisible()
    await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(
      0,
    )
  })
})
