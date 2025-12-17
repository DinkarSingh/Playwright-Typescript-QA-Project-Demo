import dotenv from "dotenv";
dotenv.config();

export const defaultData = {
  apibaseURL: [
    {
      baseURL: "https://www.automationexercise.com",
    },
  ],
  uibaseURL: [
    {
      baseURL: "https://www.automationexercise.com",
    },
  ],
  userCredentials: [
    {
      email: process.env.USER_EMAIL || "",
      password: process.env.USER_PASSWORD || "",
    },
  ],
};
