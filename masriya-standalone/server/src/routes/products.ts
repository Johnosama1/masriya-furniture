import { Router } from "express";
import { db, productsTable } from "../db.js";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const CategoryEnum = z.enum(["children", "adult", "living", "videos"]);

const ListProductsQuery = z.object({
  category: CategoryEnum.optional(),
  subcategory: z.string().optional(),
});

const CreateProductBody = z.object({
  name: z.string().min(1),
  nameEn: z.string().min(1),
  description: z.string().default(""),
  price: z.number().nullable().optional(),
  discountPercent: z.number().int().nullable().optional(),
  category: CategoryEnum,
  subcategory: z.string().nullable().optional(),
  measurements: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  videoUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

const UpdateProductBody = CreateProductBody.partial();

const IdParam = z.object({ id: z.coerce.number().int().positive() });

// ─── Serializer ──────────────────────────────────────────────────────────────
function serializeProduct(row: typeof productsTable.$inferSelect) {
  return {
    ...row,
    price: row.price ? Number(row.price) : null,
    createdAt: row.createdAt.toISOString(),
  };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  const query = ListProductsQuery.parse(req.query);
  const rows = query.category
    ? await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.category, query.category))
        .orderBy(asc(productsTable.sortOrder), asc(productsTable.id))
    : await db
        .select()
        .from(productsTable)
        .orderBy(asc(productsTable.sortOrder), asc(productsTable.id));
  res.json(rows.map(serializeProduct));
});

router.post("/", async (req, res) => {
  const body = CreateProductBody.parse(req.body);
  const [row] = await db
    .insert(productsTable)
    .values({
      name: body.name,
      nameEn: body.nameEn,
      description: body.description,
      price: body.price != null ? String(body.price) : null,
      discountPercent: body.discountPercent ?? null,
      category: body.category,
      subcategory: body.subcategory ?? null,
      measurements: body.measurements ?? null,
      images: body.images,
      videoUrl: body.videoUrl ?? null,
      sortOrder: body.sortOrder ?? 0,
    })
    .returning();
  res.status(201).json(serializeProduct(row));
});

router.get("/:id", async (req, res) => {
  const { id } = IdParam.parse({ id: req.params.id });
  const [row] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!row) { res.status(404).json({ message: "Not found" }); return; }
  res.json(serializeProduct(row));
});

router.put("/:id", async (req, res) => {
  const { id } = IdParam.parse({ id: req.params.id });
  const body = UpdateProductBody.parse(req.body);

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.nameEn !== undefined) updates.nameEn = body.nameEn;
  if (body.description !== undefined) updates.description = body.description;
  if (body.price !== undefined) updates.price = body.price != null ? String(body.price) : null;
  if (body.discountPercent !== undefined) updates.discountPercent = body.discountPercent;
  if (body.category !== undefined) updates.category = body.category;
  if (body.subcategory !== undefined) updates.subcategory = body.subcategory;
  if (body.measurements !== undefined) updates.measurements = body.measurements;
  if (body.images !== undefined) updates.images = body.images;
  if (body.videoUrl !== undefined) updates.videoUrl = body.videoUrl;
  if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;

  const [row] = await db
    .update(productsTable)
    .set(updates)
    .where(eq(productsTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ message: "Not found" }); return; }
  res.json(serializeProduct(row));
});

router.delete("/:id", async (req, res) => {
  const { id } = IdParam.parse({ id: req.params.id });
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.json({ success: true });
});

export default router;
