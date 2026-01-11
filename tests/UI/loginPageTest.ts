import { expect, test } from "@playwright/test";
import { defaultData } from "../../data/default";
import { signup } from "../../services/signup";
import { faker } from "@faker-js/faker";

const userName = faker.person.firstName();
const userEmail = faker.internet.email();
const userPassword = faker.internet.password({ length: 10 });

test.describe("invalid login test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
    await expect(page.getByRole("heading", { name: "conduit" })).toBeVisible();
  });

  test("should login with invalid credentials", async ({ page }) => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill("Hello@world.com");
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(defaultData.userCredentials[0].password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("body Invalid credentials")).toBeVisible();
  });
});

test.describe("user sign up test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();
  });
  test("user can sign up", async ({ page }) => {
    await expect(page.getByText("Have an account?")).toBeVisible();

    await page.getByRole("textbox", { name: "Username" }).fill(userName);
    await page.getByRole("textbox", { name: "Email" }).fill(userEmail);
    await page.getByRole("textbox", { name: "Password" }).fill(userPassword);
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText("Your Feed")).toBeVisible();
  });
});

test.describe("valid login test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
    await signup(userEmail, userPassword, userName);
  });

  test("user can sign in", async ({ page }) => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(userEmail);
    await page.getByRole("textbox", { name: "Password" }).fill(userPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("link", { name: userName })).toBeVisible();
  });
});
