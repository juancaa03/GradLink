import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const authRoutes = (dataSource) => {
  const router = express.Router();
  const userRepo = dataSource.getRepository("User");

  // Registro
  router.post("/register", async (req, res) => {
    const { name, email, password, role = "student" } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    try {
      const newUser = userRepo.create({ name, email, password: hashed, role });
      const savedUser = await userRepo.save(newUser);
      res.status(201).json({
        message: "User registered",
        user: {
          id: savedUser.id,
          email: savedUser.email,
          name: savedUser.name,
          role: savedUser.role,
        },
      });
    } catch (err) {
      res.status(400).json({ error: "Email already in use or invalid data" });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await userRepo.findOneBy({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  });

  // Ruta protegida: /me
  router.get("/me", authenticateToken, async (req, res) => {
    const user = await userRepo.findOneBy({ id: req.user.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });

  return router;
};

export default authRoutes;
