import { validateEnv } from "./config/env.validation";
import fs from "fs";

export default async function globalSetup() {
  validateEnv();
  // Only create auth directory if it doesn't exist
  if (!fs.existsSync("auth")) {
    fs.mkdirSync("auth", { recursive: true });
  }

  // Create empty storage state if it doesn't exist
  if (!fs.existsSync("auth/storageState.json")) {
    fs.writeFileSync(
      "auth/storageState.json",
      JSON.stringify({ cookies: [], origins: [] }),
    );
  }
}
