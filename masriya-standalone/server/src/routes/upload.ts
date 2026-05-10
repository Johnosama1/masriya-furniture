import { Router } from "express";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

router.post("/", upload.array("images", 20), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ message: "No files uploaded" });
    return;
  }
  const urls = files.map(
    (f) => `data:${f.mimetype};base64,${f.buffer.toString("base64")}`,
  );
  res.json({ urls });
});

export default router;
