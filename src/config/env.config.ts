import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  MONGO_URI: z.url(),
  NO_DB: z.enum(["true", "false"]).transform((v) => v === "true"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  SERVER_EMAIL: z.email(),
  SERVER_EMAIL_SECRET: z.string().min(8, "SERVER_EMAIL_SECRET is too short"),
  TEMPLE_ID: z.string().min(1),
  BASE_API_URL: z.url(),
  BASE_URL: z.url(),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),
});

export const env = envSchema.parse(process.env);
