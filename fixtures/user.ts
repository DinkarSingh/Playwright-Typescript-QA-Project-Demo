import { test as base, request } from "@playwright/test";
import { defaultData } from "../data/default";
import { signup } from "../services/login";

export const test = base.extend<{ user: { login: () => Promise<string> } }>({
  user: async ({ page }, use) => {
    const login = async (): Promise<string> => {
      const baseURL = defaultData.uibaseURL[0].baseURL;
      const loginPageUrl = `${baseURL}/#/login`;

      try {
        await page.goto(loginPageUrl);
        await signup(
          defaultData.userCredentials[0].email,
          defaultData.userCredentials[0].password,
          "TestUser",
        );

        await page.getByRole("link", { name: "Sign in" }).click();
        await page
          .getByRole("textbox", { name: "Email" })
          .fill(defaultData.userCredentials[0].email);
        await page
          .getByRole("textbox", { name: "Password" })
          .fill(defaultData.userCredentials[0].password);

        const [response] = await Promise.all([
          page.waitForResponse(`**/users/login`),
          page.getByRole("button", { name: "Sign in" }).click(),
        ]);

        const responseData = await response.json();
        const token = responseData.user.token;
        return token;
      } catch (error) {
        console.error("Login process failed:", error);
        throw error;
      }
    };

    await use({ login });
  },
});
