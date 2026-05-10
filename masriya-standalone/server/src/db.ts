import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

// ─── Schema ──────────────────────────────────────────────────────────────────

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }),
  discountPercent: integer("discount_percent"),
  category: text("category").notNull(), // children | adult | living | videos
  subcategory: text("subcategory"),
  measurements: text("measurements"),
  images: text("images").array().notNull().default([]),
  videoUrl: text("video_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Product = typeof productsTable.$inferSelect;
export type InsertProduct = typeof productsTable.$inferInsert;

// ─── Database Connection ──────────────────────────────────────────────────────

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Please copy .env.example to .env and fill in your database URL.",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool);
