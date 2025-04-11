import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const orderRoutes = (dataSource) => {
  const router = express.Router();
  const orderRepo = dataSource.getRepository("Order");
  const cartRepo = dataSource.getRepository("CartItem");
  const userRepo = dataSource.getRepository("User");

  // Crear nuevo pedido
  router.post("/", async (req, res) => {
    const { serviceId } = req.body;
    const user = req.user; // Requiere que authMiddleware lo haya seteado

    try {
      const order = orderRepo.create({
        service: { id: serviceId },
        user: { id: user.id },
        status: "processing"
      });
      const saved = await orderRepo.save(order);
      res.status(201).json(saved);
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "No se pudo crear el pedido" });
    }
  });

  // Obtener pedidos del usuario autenticado
  router.get("/mine", async (req, res) => {
    const user = req.user;
    const orders = await orderRepo.find({
      where: { user: { id: user.id } },
    });
    res.json(orders);
  });

  // Obtener todos los pedidos (solo admin)
  router.get("/", async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Acceso denegado" });
    const allOrders = await orderRepo.find();
    res.json(allOrders);
  });

  // Actualizar estado (solo admin)
  router.patch("/:id", async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Acceso denegado" });

    const { status } = req.body;
    const order = await orderRepo.findOneBy({ id: parseInt(req.params.id) });
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });

    order.status = status;
    await orderRepo.save(order);
    res.json({ message: "Estado actualizado", order });
  });

    // Confirmar pedido y guardar orden después de Stripe
  router.post("/confirm", authenticateToken, async (req, res) => {
    try {
      const user = await userRepo.findOneBy({ id: req.user.id });
      const cartItems = await cartRepo.find({
        where: { user: { id: user.id } },
        relations: ["service"],
      });
  
      if (!cartItems.length) {
        return res.status(400).json({ error: "El carrito está vacío" });
      }
  
      for (const item of cartItems) {
        const order = orderRepo.create({
          user,
          service: item.service,
          status: "processing",
        });
        await orderRepo.save(order);
      }
  
      // Vaciar carrito después de la compra
      await cartRepo.remove(cartItems);
  
      res.status(201).json({ message: "Compra completada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al confirmar la compra" });
    }
  });

  return router;
};

export default orderRoutes;
