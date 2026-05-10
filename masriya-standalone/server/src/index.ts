import "dotenv/config";
import app from "./app.js";

const PORT = parseInt(process.env.PORT ?? "8080", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 API Server running on http://localhost:${PORT}/api`);
  console.log(`   Health check: http://localhost:${PORT}/api/healthz\n`);
});
