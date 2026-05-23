import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().min(1),
  NO_DB: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.string(),
  SERVER_EMAIL: z.string(),
  SERVER_EMAIL_SECRET: z.string(),
  TEMPLE_ID: z.string(),
  BASE_API_URL: z.string(),
  BASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
