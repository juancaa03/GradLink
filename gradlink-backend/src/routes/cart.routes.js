import express from "express";
import Stripe from "stripe";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const cartRoutes = (dataSource) => {
  const router = express.Router();
  const cartRepo = dataSource.getRepository("CartItem");
  const serviceRepo = dataSource.getRepository("Service");
  const userRepo = dataSource.getRepository("User");

  // Obtener carrito del usuario actual
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const items = await cartRepo.find({
        where: { user: { id: req.user.id } },
        relations: ["service"],
      });

      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  });

  // Añadir un servicio al carrito
  router.post("/add", authenticateToken, async (req, res) => {
    const { serviceId } = req.body;

    const cartRepo = dataSource.getRepository("CartItem");
    const userRepo = dataSource.getRepository("User");
    const serviceRepo = dataSource.getRepository("Service");

    try {
      const user = await userRepo.findOneBy({ id: req.user.id });
      const service = await serviceRepo.findOneBy({ id: serviceId });

      if (!user || !service) return res.status(404).json({ error: "Usuario o servicio no encontrado" });

      const existing = await cartRepo.findOne({ where: { user: { id: user.id }, service: { id: service.id } } });

      if (existing) return res.status(200).json({ message: "Ya estaba en el carrito" });

      const item = cartRepo.create({ user, service });
      await cartRepo.save(item);

      res.status(201).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al añadir al carrito" });
    }
  });


  // Eliminar un servicio del carrito
  router.delete("/:id", authenticateToken, async (req, res) => {
    const cartItemId = parseInt(req.params.id);

    try {
      const item = await cartRepo.findOne({
        where: { id: cartItemId, user: { id: req.user.id } },
      });

      if (!item) return res.status(404).json({ error: "Elemento no encontrado" });

      await cartRepo.remove(item);
      res.json({ message: "Elemento eliminado del carrito" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar el elemento" });
    }
  });

  // Vaciar carrito completamente
  router.delete("/", authenticateToken, async (req, res) => {
    try {
      const items = await cartRepo.find({
        where: { user: { id: req.user.id } },
      });
      await cartRepo.remove(items);
      res.json({ message: "Carrito vaciado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al vaciar el carrito" });
    }
  });

  // Eliminar un servicio del carrito por serviceId
  router.post("/remove", authenticateToken, async (req, res) => {
    const { serviceId } = req.body;

    try {
      const item = await cartRepo.findOne({
        where: {
          service: { id: serviceId },
          user: { id: req.user.id },
        },
        relations: ["service", "user"],
      });

      if (!item) return res.status(404).json({ error: "Elemento no encontrado en el carrito" });

      await cartRepo.remove(item);
      res.json({ message: "Elemento eliminado del carrito" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar el elemento del carrito" });
    }
  });

  router.post("/checkout", authenticateToken, async (req, res) => {
    try {
      const cartItems = await cartRepo.find({
        where: { user: { id: req.user.id } },
        relations: ["service"],
      });

      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Tu carrito está vacío" });
      }

      const lineItems = cartItems.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.service.title,
          },
          unit_amount: Math.round(parseFloat(item.service.price) * 100),
        },
        quantity: 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
        metadata: {
          userId: req.user.id.toString(),
        },
      });

      res.json({ url: session.url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error iniciando el checkout" });
    }
  });

  return router;
};

export default cartRoutes;
