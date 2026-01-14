import { z } from "zod";
import { defaultData } from "./default";

export const uibaseURL = z.object({
  baseURL: z.url(),
});

export const publicAPIbaseURL = z.object({
  baseURL: z.url(),
});

export const userCredentials = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const dataSchema = z.object({
  publicAPIbaseURL: z.array(publicAPIbaseURL),
  uibaseURL: z.array(uibaseURL),
  userCredentials: z.array(userCredentials),
});

export function getData(): z.infer<typeof dataSchema> {
  return dataSchema.parse(defaultData);
}
