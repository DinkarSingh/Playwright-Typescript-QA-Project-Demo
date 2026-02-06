import { expect } from "playwright/test";
import { test } from "../../fixtures/user";
import { faker } from "@faker-js/faker";
import { getCurrentDateFormatted } from "@support/date";
import { createArticle, deleteArticle } from "../../services/article";

const articalTitle = faker.person.firstName();
const articalAbout = faker.lorem.sentence();
const articalContent = faker.lorem.sentences();
const articalTag = "api";

test.describe("New Article Page Test", () => {
  test.beforeEach(async ({ page, user }) => {
    await user.login();
    await page.goto("/editor");
  });

  test("user can create a new article", async ({ page }) => {
    await page
      .getByRole("textbox", { name: "Article Title" })
      .fill(articalTitle);
    await page
      .getByRole("textbox", { name: "What's this article about?" })
      .fill(articalAbout);
    await page
      .getByRole("textbox", { name: "Write your article (in" })
      .fill(articalContent);
    await page.getByRole("textbox", { name: "Enter tags" }).fill(articalTag);
    await page.getByRole("textbox", { name: "Enter tags" }).press("Enter");
    await page.getByRole("button", { name: "Publish Article" }).click();

    const articalDeploymentDate = getCurrentDateFormatted("comma");

    await expect(page.getByText(articalTitle)).toBeVisible();
    await expect(page.getByText(articalDeploymentDate).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: " Edit Article" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: " Delete Article" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "TestUser" }).nth(1),
    ).toBeVisible();
  });
});

test.describe("Edit and delete the article Tests", () => {
  const updateTitle = faker.person.firstName();

  let token_id: string;
  let userName: string;

  test.beforeEach(async ({ user }) => {
    const token = await user.login();
    token_id = token;
    await createArticle(
      articalTitle,
      articalAbout,
      articalContent,
      [articalTag],
      token,
    );
  });

  test.afterEach(async () => {
    await deleteArticle(userName, token_id);
  });

  test("user can edit/delete a article", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Your Feed" }).click();
    await page
      .getByRole("listitem")
      .filter({ hasText: "Global Feed" })
      .getByRole("link")
      .click();
    await Promise.all([
      page.waitForResponse("**/articles?**"),
      page.getByText(articalTitle).first().click(),
    ]);

    const articalDeploymentDate = getCurrentDateFormatted("comma");

    await expect(page.getByText(articalTitle)).toBeVisible();
    await expect(page.getByText(articalDeploymentDate).first()).toBeVisible();

    await page.getByRole("link", { name: " Edit Article" }).first().click();
    await page.waitForTimeout(1000);
    await page
      .getByRole("textbox", { name: "Article Title" })
      .fill(updateTitle);

    await Promise.all([
      page.waitForResponse(`**/articles/${updateTitle.toLocaleLowerCase()}`),
      page.getByRole("button", { name: "Publish Article" }).click(),
    ]);

    userName = updateTitle.toLocaleLowerCase();
    await expect(page.getByText(updateTitle).first()).toBeVisible();
    await expect(page.getByText(articalDeploymentDate).first()).toBeVisible();
  });
});
