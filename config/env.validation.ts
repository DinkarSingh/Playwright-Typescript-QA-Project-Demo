import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  USER_EMAIL: z
    .string()
    .email("USER_EMAIL must be a valid email address")
    .min(1, "USER_EMAIL is required in .env file"),
  USER_PASSWORD: z
    .string()
    .min(1, "USER_PASSWORD is required in .env file")
    .min(6, "USER_PASSWORD must be at least 6 characters long"),
  CI: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  JUNIT_FILE: z.string().optional(),
});

// Validate and parse environment variables
export function validateEnv() {
  // Skip validation in CI environment
  if (process.env.CI) {
    return {
      USER_EMAIL: process.env.USER_EMAIL || "",
      USER_PASSWORD: process.env.USER_PASSWORD || "",
      CI: true,
      JUNIT_FILE: process.env.JUNIT_FILE,
    };
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("\n❌ Environment variable validation failed:\n");
    result.error.issues.forEach((issue) => {
      console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
    });
    console.error(
      "\n💡 Check your .env file and ensure all required variables are set.\n",
    );
    process.exit(1);
  }

  return result.data;
}

// Export validated environment variables
export const env = validateEnv();
