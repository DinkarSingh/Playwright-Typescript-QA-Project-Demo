import { expect, test } from "@playwright/test";
import { defaultData } from "../../data/default";

test.describe("Login Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Consent" }).click();
  });

  test("User cannot login with incorrect credentials", async ({ page }) => {
    await page.getByRole("link", { name: " Signup / Login" }).click();
    await page
      .locator("form")
      .filter({ hasText: "Login" })
      .getByPlaceholder("Email Address")
      .fill(defaultData.userCredentials[0].email);
    await page
      .getByRole("textbox", { name: "Password" })
      .fill("your_password_here");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(
      page.getByText("Your email or password is incorrect!"),
    ).toBeVisible();
  });

  test("should load the login page and display the correct title", async ({
    page,
  }) => {
    await page.getByRole("link", { name: " Signup / Login" }).click();
    await page
      .locator("form")
      .filter({ hasText: "Login" })
      .getByPlaceholder("Email Address")
      .fill(defaultData.userCredentials[0].email);
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(defaultData.userCredentials[0].password);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByRole("link", { name: " Logout" })).toBeVisible();
  });
});
