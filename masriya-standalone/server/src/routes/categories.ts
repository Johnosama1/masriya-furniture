import { Router } from "express";
import { db, productsTable } from "../db.js";
import { sql } from "drizzle-orm";

const router = Router();

const CATEGORY_LABELS: Record<string, string> = {
  children: "غرف الأطفال",
  adult: "غرف النوم الكبيرة",
  living: "الانتريهات والركن",
  videos: "فيديوهات",
};

router.get("/summary", async (_req, res) => {
  const rows = await db
    .select({
      category: productsTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(productsTable)
    .groupBy(productsTable.category);

  const summary = Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
    const found = rows.find((r) => r.category === cat);
    return { category: cat, count: found ? found.count : 0, label };
  });

  res.json(summary);
});

export default router;
