import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const orderRoutes = (dataSource) => {
  const router = express.Router();
  const orderRepo = dataSource.getRepository("Order");
  const cartRepo = dataSource.getRepository("CartItem");
  const userRepo = dataSource.getRepository("User");

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

  // Actualizar estado (solo admin)
  router.put("/:id", authenticateToken, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Acceso denegado" });

    const { status } = req.body;
    const orderId = parseInt(req.params.id, 10);
    try {
      const order = await orderRepo.findOne({ where: { id: orderId } });
      if (!order) return res.status(404).json({ error: "Pedido no encontrado" });

      order.status = status;
      const updated = await orderRepo.save(order);
      res.json({ message: "Estado actualizado", order: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar estado" });
    }
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
