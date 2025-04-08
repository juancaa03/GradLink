import "dotenv/config";
import "reflect-metadata";
import bcrypt from "bcrypt";
import { AppDataSource } from "./data-source.js";
import { User } from "./entities/User.js";
import { Service } from "./entities/Service.js";
import { Order } from "./entities/Order.js";

const seed = async () => {
  try {
    await AppDataSource.initialize();
    console.log("📦 Connected to DB for seeding...");

    // 1. Crear usuarios
    const userRepo = AppDataSource.getRepository("User");

    const hashedPass = await bcrypt.hash("123456", 10);

    const student = userRepo.create({
      name: "Juan Dev",
      email: "juan@example.com",
      password: hashedPass,
      role: "student"
    });

    const admin = userRepo.create({
      name: "Admin Boss",
      email: "admin@example.com",
      password: hashedPass,
      role: "admin"
    });

    await userRepo.save([student, admin]);
    console.log("✅ Usuarios creados");

    // 2. Crear un servicio publicado por el estudiante
    const serviceRepo = AppDataSource.getRepository("Service");

    const service = serviceRepo.create({
      title: "Clases de programación web",
      description: "HTML, CSS, JS y React desde 0",
      price: 25,
      user: student
    });

    await serviceRepo.save(service);
    console.log("✅ Servicio creado");

    // 3. Crear un pedido (el mismo usuario compra su propio servicio como demo)
    const orderRepo = AppDataSource.getRepository("Order");

    const order = orderRepo.create({
      user: student,
      service: service,
      status: "processing"
    });

    await orderRepo.save(order);
    console.log("✅ Pedido creado");

    console.log("🌱 Seeding completado con éxito.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al hacer el seed:", err);
    process.exit(1);
  }
};

seed();
