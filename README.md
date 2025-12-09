# Playwright Project Setup with TypeScript on Window machine

This repository demonstrates setting up Playwright with TypeScript for end-to-end testing.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- npm (comes with Node.js)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd playwright-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers (first time only):

    ```bash
   npx playwright install
   ```

4. (Optional) Run static code checks:

   ```bash
   npm run static:test
   ```

5. Running Tests

   Run All Tests

      ```bash
      npx playwright test
      ```

   Run UI Tests

      ```bash
      npx playwright test --project='default' --workers=1 --headed
      ```

   Run API Tests

   ```bash
      npx playwright test --project='public-api' --workers=1
   ```

## Additional Notes

- UI tests run in headed mode for better debugging.
- API tests run in headless mode by default.
- Test reports (HTML and JUnit) are generated in the playwright-report folder.
- Environment variables such as USER_EMAIL and USER_PASSWORD should be set in. 
- your GitHub repository secrets or CI/CD environment for authentication tests.

## CI/CD

- GitHub Actions workflow is provided in .github/workflows/playwright.yml.
- The pipeline runs linting, API tests, UI tests, and collects Playwright reports.
- JUnit and HTML reports are available as workflow artifacts.
