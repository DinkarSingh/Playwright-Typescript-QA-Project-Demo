import { defineConfig, devices } from "@playwright/test";
import { defaultData } from "./data/default";

export default defineConfig({
  globalSetup: require.resolve("./global-setup.ts"),
  testDir: "./tests",
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    [
      "junit",
      { outputFile: process.env.JUNIT_FILE || "playwright-report/results.xml" },
    ],
  ],
  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    headless: !!process.env.CI,
  },
  projects: [
    {
      name: "default",
      testDir: "./tests/UI",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: defaultData.uibaseURL[0].baseURL,
      },
    },
    {
      name: "public-api",
      testDir: "./tests/API",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: defaultData.publicAPIbaseURL[0].baseURL,
      },
    },
  ],
});
