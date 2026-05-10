import { Router } from "express";
import { z } from "zod";

const router = Router();

const HealthCheckResponse = z.object({ status: z.literal("ok") });

router.get("/healthz", (_req, res) => {
  res.json(HealthCheckResponse.parse({ status: "ok" }));
});

export default router;
