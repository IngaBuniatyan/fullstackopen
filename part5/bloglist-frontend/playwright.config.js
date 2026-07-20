import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const backendDirectory = fileURLToPath(
  new URL('../../part4/bloglist', import.meta.url),
)

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run start:test',
      cwd: backendDirectory,
      url: 'http://127.0.0.1:3003/api/blogs',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
})
