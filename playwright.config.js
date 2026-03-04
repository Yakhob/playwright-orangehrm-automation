// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Sequential execution is vital for CRUD to avoid data collisions
  fullyParallel: false, 
  workers: 1,
  retries: 1, 
  reporter: 'html',
  // Increased global timeout to 90s to give slow demo environments room
  timeout: 90000, 

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    navigationTimeout: 60000,
    actionTimeout: 20000,
    // Traces are the best way to debug why middleName was ""
    trace: 'retain-on-failure', 
    screenshot: 'only-on-failure', 
    video: 'on-first-retry',
    headless: true,
    // Ensures tests wait for a stable network before proceeding
    launchOptions: {
      args: ['--disable-dev-shm-usage']
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});