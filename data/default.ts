import dotenv from "dotenv";
dotenv.config();

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
      email: process.env.USER_EMAIL || "",
      password: process.env.USER_PASSWORD || "",
    },
  ],
};
