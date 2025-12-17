import { test } from "../../fixtures/user";
import { expect } from "@playwright/test";

test.describe("Create New Contact", () => {
  test.beforeEach(async ({ page, user }) => {

    const baseURL = test.info().project.use.baseURL;
    console.log("Project baseURL:", baseURL);
    console.log("Page URL before login:", page.url());
    await user.login();
    await page.goto("/products");
    await page.getByRole('button', { name: 'Consent' }).click();
  });

  test("should create a new contact and verify in list", async ({ page }) => {
    await page.getByRole('textbox', { name: 'Search Product' }).fill("Men Tshirt");
    await page.getByRole('button', { name: '' }).click();
    await page.getByText('Men Tshirt').nth(2).hover();
    await page.getByText('Add to cart').nth(1).click();
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible();
  });
});
