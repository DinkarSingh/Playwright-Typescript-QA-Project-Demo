import { test, expect } from "@playwright/test";
import { defaultData } from "../../data/default";
import { StatusCodes } from "http-status-codes";

const baseURL = defaultData.publicAPIbaseURL[0].baseURL;

// Test credentials - generate unique each time
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `testuser_${Date.now()}@example.com`,
  password: "testpassword123",
};

let authToken: string;

// Reusable headers
const jsonHeaders = { "Content-Type": "application/json" };
const authHeaders = (token: string) => ({
  Authorization: `Token ${token}`,
  "Content-Type": "application/json",
});

// Helper function to validate user response structure
const validateUserResponse = (user: any, email: string) => {
  expect(user).toHaveProperty("email");
  expect(user).toHaveProperty("token");
  expect(user).toHaveProperty("username");
  expect(user).toHaveProperty("bio");
  expect(user).toHaveProperty("image");
  expect(user.email).toBe(email);
};

// Helper function to make API request and parse response
const makeApiRequest = async (
  request: any,
  method: string,
  endpoint: string,
  data?: any,
  headers?: any,
) => {
  const response = await request[method](`${baseURL}${endpoint}`, {
    ...(data && { data }),
    headers,
  });
  expect(response.status()).toBe(StatusCodes.OK);
  return response.json();
};

test.describe("API Tests - RealWorld Authentication", () => {
  test.beforeAll(async ({ request }) => {
    // First, create a test user for our tests
    const signupResponse = await request.post(`${baseURL}/users`, {
      data: {
        user: {
          username: testUser.username,
          email: testUser.email,
          password: testUser.password,
        },
      },
      headers: jsonHeaders,
    });

    // User creation should succeed (201) or user might already exist (422)
    expect([StatusCodes.CREATED, StatusCodes.UNPROCESSABLE_ENTITY]).toContain(
      signupResponse.status(),
    );

    console.log(`Test user setup complete: ${testUser.email}`);
  });

  test("POST - Login with valid credentials", async ({ request }) => {
    const responseBody = await makeApiRequest(
      request,
      "post",
      "/users/login",
      { user: { email: testUser.email, password: testUser.password } },
      jsonHeaders,
    );

    expect(responseBody).toHaveProperty("user");
    validateUserResponse(responseBody.user, testUser.email);
    expect(responseBody.user.token).toBeDefined();

    authToken = responseBody.user.token;
  });

  test("GET - Authenticate current user", async ({ request }) => {
    test.skip(
      !authToken,
      "Auth token not available - login test must run first",
    );

    const responseBody = await makeApiRequest(
      request,
      "get",
      "/user",
      undefined,
      authHeaders(authToken),
    );

    expect(responseBody).toHaveProperty("user");
    validateUserResponse(responseBody.user, testUser.email);
  });

  test("PUT - Update user information", async ({ request }) => {
    test.skip(
      !authToken,
      "Auth token not available - login test must run first",
    );

    const updatedBio = `Updated bio - ${Date.now()}`;

    const responseBody = await makeApiRequest(
      request,
      "put",
      "/user",
      { user: { bio: updatedBio } },
      authHeaders(authToken),
    );

    expect(responseBody).toHaveProperty("user");
    validateUserResponse(responseBody.user, testUser.email);
    expect(responseBody.user.bio).toBe(updatedBio);
  });
});
