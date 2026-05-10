import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Check your .env file.");
}

export default defineConfig({
  schema: "./server/src/db.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  out: "./server/drizzle",
});
