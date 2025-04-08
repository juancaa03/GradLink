import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";

import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { authenticateToken } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL vía TypeORM
const dataSource = new DataSource((await import("../ormconfig.js")).default);

dataSource.initialize().then(() => {
  console.log("📦 Connected to PostgreSQL via TypeORM");

  // Rutas
  app.use("/api/auth", authRoutes(dataSource));
  app.use("/api/services", serviceRoutes(dataSource));
  app.use("/api/orders", authenticateToken, orderRoutes(dataSource));

  // Ruta base de prueba
  app.get("/", (req, res) => {
    res.send("GradLink API is running 🚀");
  });

  // Arrancar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Error connecting to DB", err);
});
