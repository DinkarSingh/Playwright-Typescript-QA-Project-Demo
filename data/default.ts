import { env } from "../config/env.validation";

export const defaultData = {
  uibaseURL: [
    {
      baseURL: "https://demo.realworld.show",
    },
  ],
  publicAPIbaseURL: [
    {
      baseURL: "https://api.realworld.show/api",
    },
  ],
  userCredentials: [
    {
      email: env.USER_EMAIL,
      password: env.USER_PASSWORD,
    },
  ],
};
