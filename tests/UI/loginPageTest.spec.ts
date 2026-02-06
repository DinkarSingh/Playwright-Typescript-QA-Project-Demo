import { expect, test } from "@playwright/test";
import { defaultData } from "../../data/default";
import { signup } from "../../services/login";
import { faker } from "@faker-js/faker";

const userName = faker.person.firstName();
const userEmail = faker.internet.email();
const userPassword = faker.internet.password({ length: 10 });

const navigateToHomepage = async (page: any) => {
  await page.goto("");
  await expect(page.getByRole("heading", { name: "conduit" })).toBeVisible();
};

const navigateToSignIn = async (page: any) => {
  await page.getByRole("link", { name: "Sign in" }).click();
};

const navigateToSignUp = async (page: any) => {
  await page.getByRole("link", { name: "Sign up" }).click();
  await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();
};

const fillLoginForm = async (page: any, email: string, password: string) => {
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
};

const fillSignupForm = async (
  page: any,
  username: string,
  email: string,
  password: string,
) => {
  await page.getByRole("textbox", { name: "Username" }).fill(username);
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign up" }).click();
};

test.describe("invalid login test", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHomepage(page);
  });

  test("should login with invalid credentials", async ({ page }) => {
    await navigateToSignIn(page);
    console.log(
      "Password used for login:",
      defaultData.userCredentials[0].password,
    );
    await fillLoginForm(
      page,
      "Hello@world.com",
      defaultData.userCredentials[0].password,
    );

    await expect(
      page.getByText(
        "network Unable to connect. Please check your internet connection.",
      ),
    ).toBeVisible();
  });
});

test.describe("user sign up test", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHomepage(page);
    await navigateToSignUp(page);
  });

  test("user can sign up", async ({ page }) => {
    await expect(page.getByText("Have an account?")).toBeVisible();
    await fillSignupForm(page, userName, userEmail, userPassword);

    await expect(page.getByText("Your Feed")).toBeVisible();
  });
});

test.describe("valid login test", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHomepage(page);
    await signup(userEmail, userPassword, userName);
  });

  test("user can sign in", async ({ page }) => {
    await navigateToSignIn(page);
    await fillLoginForm(page, userEmail, userPassword);

    await expect(page.getByRole("link", { name: userName })).toBeVisible();
  });
});
