# 🎭 Playwright Test Automation Framework

A comprehensive end-to-end testing framework built with Playwright and TypeScript for testing the RealWorld application.

## 🎯 Project Objective

This project demonstrates a robust and maintainable test automation strategy using Playwright with TypeScript. The framework focuses on:

• **Critical user journey coverage** - Testing essential application workflows
• **API and UI testing integration** - Combining both approaches for comprehensive coverage  
• **Maintainable architecture** - Clean separation of concerns and reusable components
• **Real-world scenarios** - Practical testing patterns for production applications

## 🌐 Application Under Test

This framework tests the **RealWorld** demo application - a Medium.com clone that demonstrates real-world functionality.

🔗 **UI Application**: [https://demo.realworld.show](https://demo.realworld.show)  
🔗 **API Endpoint**: [https://api.realworld.show/api](https://api.realworld.show/api)

The application includes realistic scenarios for:
• User authentication (signup/login)
• Article creation and management  
• User interactions and workflows
• Data persistence and state management

## 🔌 API Testing Implementation

### RealWorld API Integration

The framework includes comprehensive API testing for the [RealWorld API specification](https://documenter.getpostman.com/view/1841370/realworld-api/7TFGFZA), covering core authentication workflows:

#### Test Coverage

| Endpoint       | Method | Purpose              | Validation                           |
| -------------- | ------ | -------------------- | ------------------------------------ |
| `/users`       | POST   | User registration    | Creates test user for authentication |
| `/users/login` | POST   | User authentication  | Validates JWT token generation       |
| `/user`        | GET    | Current user profile | Confirms authenticated user details  |
| `/user`        | PUT    | Profile updates      | Tests user information modification  |

#### Implementation Highlights

**🔑 Dynamic User Creation**

```typescript
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `testuser_${Date.now()}@example.com`,
  password: "testpassword123",
};
```

- Generates unique credentials for each test run
- Eliminates conflicts with existing users
- Ensures clean test state without dependencies

**🛡️ Authentication Flow**

```typescript
// 1. Create user via signup
await request.post("/users", { user: testUser });

// 2. Login and extract token
const loginResponse = await request.post("/users/login", { user: credentials });
const authToken = loginResponse.user.token;

// 3. Use token for authenticated requests
await request.get("/user", {
  headers: { Authorization: `Token ${authToken}` },
});
```

**⚡ Optimized Code Structure**

- **Helper Functions**: Eliminated ~60% code duplication
- **Reusable Validators**: Common response structure validation
- **Centralized Headers**: Consistent authentication patterns
- **Error Handling**: Graceful test skipping when dependencies fail

#### API Test Architecture

```typescript
// Reusable components for clean, maintainable tests
const jsonHeaders = { "Content-Type": "application/json" };
const authHeaders = (token: string) => ({
  Authorization: `Token ${token}`,
  "Content-Type": "application/json",
});

const validateUserResponse = (user: any, email: string) => {
  expect(user).toHaveProperty("email");
  expect(user).toHaveProperty("token");
  expect(user).toHaveProperty("username");
  expect(user.email).toBe(email);
};
```

#### Benefits Over UI-Only Testing

- **Speed**: API tests run ~10x faster than UI equivalents
- **Reliability**: No browser dependencies or UI flakiness
- **Data Setup**: Efficient test data creation and cleanup
- **Integration Testing**: Direct service layer validation
- **CI/CD Friendly**: Minimal resource requirements

## 🏗️ Framework Architecture

### 📁 Project Structure

```
├── data/                   → Test data and configuration
│   ├── default.ts         → Environment URLs and credentials
│   └── index.ts           → Data exports
├── fixtures/              → Playwright fixtures and test setup
│   └── user.ts            → User authentication fixture
├── services/              → API service layer
│   ├── http.ts            → HTTP client configuration
│   ├── login.ts           → Authentication services
│   └── article.ts         → Article management services
├── support/               → Utility functions and helpers
│   └── date.ts            → Date formatting utilities
├── tests/                 → Test specifications
│   ├── UI/                → User interface tests
│   │   ├── loginPageTest.spec.ts    → UI authentication tests
│   │   └── newArticalPage.spec.ts   → Article creation tests
│   └── API/               → API integration tests
│       └── api_test.spec.ts         → RealWorld API test suite
├── types/                 → TypeScript type definitions
│   └── types.ts           → API response interfaces
├── utils/                 → Page helpers and utilities
│   └── pageHelpers.ts     → UI interaction utilities
├── auth/                  → Authentication artifacts
│   └── storageState.json  → Saved authentication state
├── playwright-report/     → Test execution reports
└── test-results/          → Test artifacts and screenshots
```

## 🧠 Key Testing Principles

### 1️⃣ Layered Testing Strategy

• **UI Tests**: End-to-end user workflows with browser interactions
• **API Tests**: Fast, reliable service-level testing with RealWorld API
• **Integrated Approach**: UI tests with API setup for optimal test performance
• **Authentication Testing**: Both UI login flows and API token-based auth

### 2️⃣ Service Layer Architecture

The `services/` folder provides:
• **Centralized API calls** - Reusable service functions
• **Type safety** - Full TypeScript interfaces for requests/responses
• **Authentication handling** - Token management and session control
• **Error handling** - Consistent error reporting across services

### 3️⃣ Data Management

The `data/` folder centralizes:
• **Environment configuration** - URLs for different environments (UI + API)
• **Test credentials** - Secure handling of authentication data
• **API endpoints** - Centralized endpoint management
• **Dynamic test data** - Unique user generation for isolated tests

### 4️⃣ API Testing Benefits

Tests leverage direct API calls for:
• **Independent validation** - Testing business logic without UI dependencies
• **Test data creation** - Dynamic user and content generation
• **Performance testing** - Fast execution and reliable results
• **Integration verification** - Direct service contract validation
• **Token-based auth** - Real-world authentication pattern testing

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or later)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/DinkarSingh/playwright_typescript_qa_project_demo.git
   cd playwright-project
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Install Playwright browsers**:

   ```bash
   npx playwright install
   ```

4. **Set up environment variables**:
   ```bash
   # Create .env file with your credentials
   USER_EMAIL=your-email@example.com
   USER_PASSWORD=your-password
   ```

## ▶️ Running Tests

### UI Tests (User Interface)

```bash
# Run all UI tests in headed mode
npx playwright test --project='default' --workers=1 --headed

# Run UI tests in headless mode
npx playwright test --project='default' --workers=1

# Run with debugging
npx playwright test --project='default' --workers=1 --debug
```

### API Tests (Service Level)

```bash
# Run all API tests
npx playwright test --project='public-api' --workers=1

# Run specific API test files
npx playwright test tests/API/api_test.spec.ts --project='public-api'

# Run with verbose output
npx playwright test --project='public-api' --workers=1 --reporter=verbose
```

**Available API Test Scenarios:**

- **POST /users/login** - User authentication with email/password
- **GET /user** - Current user profile retrieval with token
- **PUT /user** - User profile updates (bio, email, etc.)

**Key Features:**

- **Dynamic test data** - Generates unique users for each test run
- **Token-based authentication** - Proper JWT token handling
- **Sequential test dependencies** - Login provides tokens for subsequent tests
- **Comprehensive validation** - Full response structure verification
- **Error handling** - Graceful handling of auth failures and missing tokens

### Full Test Suite

```bash
# Run all tests (UI + API)
npx playwright test

# Run with static code analysis
npm run static:test
```

## 🔧 Framework Features

### Authentication Management

- **Automated login** via fixture system
- **Token extraction** from API responses
- **Session persistence** across test scenarios
- **Multiple authentication strategies** (UI + API)

### Service Layer Benefits

- **Reusable API calls** for test setup and verification
- **Type-safe interfaces** for all API interactions
- **Centralized configuration** for different environments
- **Built-in debugging** with comprehensive logging

### Support Functions

- **Date utilities** for dynamic test data
- **Page helpers** for common UI interactions
- **Custom fixtures** for test setup and teardown
- **Error handling** with detailed debugging information

## 🏷️ Test Organization

| Category      | Purpose                       | Location     | Examples                        |
| ------------- | ----------------------------- | ------------ | ------------------------------- |
| **UI Tests**  | End-to-end user workflows     | `tests/UI/`  | Login flow, article creation    |
| **API Tests** | Service integration testing   | `tests/API/` | Authentication, user management |
| **Services**  | Reusable API functions        | `services/`  | Login service, HTTP client      |
| **Fixtures**  | Test setup and authentication | `fixtures/`  | User fixture, auth state        |
| **Data**      | Configuration and test data   | `data/`      | URLs, credentials, test users   |

### API Test Details

The `tests/API/api_test.spec.ts` file contains three core test scenarios:

1. **POST Login Test** - Validates user authentication with email/password
2. **GET Authentication Test** - Verifies current user retrieval with token
3. **PUT User Update Test** - Tests user profile modification capabilities

Each test includes:

- **Request validation** - Proper headers and payload structure
- **Response validation** - Complete API response verification
- **Token handling** - Secure authentication token management
- **Error scenarios** - Graceful handling of authentication failures

## 🔄 CI/CD Integration

The framework integrates with GitHub Actions:
• **Pull Requests**: Fast regression testing  
• **Main Branch**: Complete test suite execution
• **Retry Logic**: CI environments get 2 retries, local development gets 0
• **Reporting**: HTML and JUnit reports with artifacts

## 📊 Reports and Debugging

### Test Reports

- **HTML Reports**: Generated in `playwright-report/`
- **JUnit XML**: Available for CI integration
- **Screenshots**: Captured on test failures
- **Videos**: Recorded for failed test scenarios

### Allure Reporting (User POV)

From your point of view, Allure gives you a clean, navigable report after each run. The setup here already enables the `allure-playwright` reporter in `playwright.config.ts`, so your job is just to generate and open the report.

**1) (One-time) Install Allure command line**

```bash
npm install --save-dev allure-commandline
```

**2) Run tests to produce Allure results**

```bash
# Full suite
npx playwright test

# Or just UI / API
npx playwright test --project=default --workers=1
npx playwright test --project=public-api --workers=1
```

This generates raw results in `allure-results/`.

**3) Generate the Allure report**

```bash
npx allure generate allure-results --clean -o allure-report
```

**4) Open the report**

```bash
npx allure open allure-report
```

**What you will see**

- **Overview dashboard** with pass/fail trends and durations
- **Suite/test breakdown** for quick triage
- **Attachments** like screenshots, traces, and videos for failed tests

### Debugging Features

- **Console logging** for API requests and responses
- **Network request inspection** with detailed payloads
- **Step-by-step debugging** with `--debug` flag
- **Screenshot capture** on failures

## 📌 Best Practices

This framework demonstrates:
• **Clean architecture** with separation of concerns
• **Type safety** throughout the testing stack  
• **Maintainable test design** with reusable components
• **Performance optimization** through strategic API usage
• **Real-world patterns** applicable to production testing

The goal is to showcase not just test automation, but **strategic test architecture** that scales with application complexity.

## ✍️ Author

Dinkar Singh Karanvanshi
