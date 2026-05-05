import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  ListProductsQueryParams,
  CreateProductBody,
  UpdateProductBody,
  GetProductParams,
  UpdateProductParams,
  DeleteProductParams,
} from "@workspace/api-zod";
import { z } from "zod/v4";

const router = Router();

router.get("/", async (req, res) => {
  const query = ListProductsQueryParams.parse(req.query);
  let rows;
  if (query.category) {
    rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.category, query.category))
      .orderBy(asc(productsTable.sortOrder), asc(productsTable.id));
  } else {
    rows = await db
      .select()
      .from(productsTable)
      .orderBy(asc(productsTable.sortOrder), asc(productsTable.id));
  }
  res.json(
    rows.map((r) => ({
      ...r,
      price: r.price ? Number(r.price) : null,
      createdAt: r.createdAt.toISOString(),
    }))
  );
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
  res.status(201).json({
    ...row,
    price: row.price ? Number(row.price) : null,
    createdAt: row.createdAt.toISOString(),
  });
});

router.get("/:id", async (req, res) => {
  const { id } = GetProductParams.parse({ id: Number(req.params.id) });
  const [row] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!row) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json({
    ...row,
    price: row.price ? Number(row.price) : null,
    createdAt: row.createdAt.toISOString(),
  });
});

router.put("/:id", async (req, res) => {
  const { id } = UpdateProductParams.parse({ id: Number(req.params.id) });
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

  if (!row) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json({
    ...row,
    price: row.price ? Number(row.price) : null,
    createdAt: row.createdAt.toISOString(),
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteProductParams.parse({ id: Number(req.params.id) });
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.json({ success: true });
});

export default router;
