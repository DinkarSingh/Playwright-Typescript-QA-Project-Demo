import { test } from "../../fixtures/user";
import { expect } from "@playwright/test";
import { handleConsentPopup } from "../../utils/pageHelpers";

test.describe("Create New Contact", () => {
  test.beforeEach(async ({ page, user }) => {
    await user.login();
    await page.goto("/products");
    await handleConsentPopup(page);
  });

  test("should create a new contact and verify in list", async ({ page }) => {
    await page
      .getByRole("textbox", { name: "Search Product" })
      .fill("Men Tshirt");
    await page.getByRole("button", { name: "" }).click();
    await page.getByText("Men Tshirt").nth(2).hover();
    await page.getByText("Add to cart").nth(1).click();
    await expect(page.getByRole("heading", { name: "Added!" })).toBeVisible();
  });
});
