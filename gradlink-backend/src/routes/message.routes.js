import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const messageRoutes = (dataSource) => {
  const router = express.Router();
  const messageRepo = dataSource.getRepository("Message");
  const userRepo = dataSource.getRepository("User");
  const serviceRepo = dataSource.getRepository("Service");

  // Enviar mensaje
  router.post("/", authenticateToken, async (req, res) => {
    const { receiverId, content, serviceId } = req.body;

    try {
      const sender = await userRepo.findOneBy({ id: req.user.id });
      const receiver = await userRepo.findOneBy({ id: receiverId });
      const service = await serviceRepo.findOneBy({ id: serviceId });

      if (!receiver) return res.status(404).json({ error: "Usuario receptor no encontrado" });

      const message = messageRepo.create({
        sender,
        receiver,
        service,
        content,
      });

      await messageRepo.save(message);
      res.status(201).json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al enviar el mensaje" });
    }
  });

  router.get("/conversations", authenticateToken, async (req, res) => {
    const messageRepo = dataSource.getRepository("Message");
  
    try {
      const messages = await messageRepo.find({
        where: [
          { sender: { id: req.user.id } },
          { receiver: { id: req.user.id } },
        ],
        relations: ["sender", "receiver"],
        order: { timestamp: "DESC" },
      });
  
      const conversationMap = new Map();
  
      for (const msg of messages) {
        const otherUser =
          msg.sender.id === req.user.id ? msg.receiver : msg.sender;
  
        if (!conversationMap.has(otherUser.id)) {
          conversationMap.set(otherUser.id, {
            user: {
              id: otherUser.id,
              name: otherUser.name,
            },
            lastMessage: msg.content,
            timestamp: msg.timestamp,
            hasUnread: msg.receiver.id === req.user.id && !msg.read,
          });
        }
      }
  
      res.json(
        Array.from(conversationMap.values()).sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        )
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error obteniendo conversaciones" });
    }
  });
  
  router.get("/has-unread", authenticateToken, async (req, res) => {
    const messageRepo = dataSource.getRepository("Message");
  
    try {
      const unreadCount = await messageRepo.count({
        where: {
          receiver: { id: req.user.id },
          read: false,
        },
      });
  
      res.json({ hasUnread: unreadCount > 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error verificando mensajes no leídos" });
    }
  });
  
  // Obtener mensajes entre usuario actual y otro
  router.get("/with/:userId", authenticateToken, async (req, res) => {
    const otherUserId = parseInt(req.params.userId);

    try {
      const messages = await messageRepo.find({
        where: [
          { sender: { id: req.user.id }, receiver: { id: otherUserId } },
          { sender: { id: otherUserId }, receiver: { id: req.user.id } },
        ],
        order: { timestamp: "ASC" },
      });

      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener mensajes" });
    }
  });

  router.put("/mark-read/:userId", authenticateToken, async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await dataSource
        .getRepository("Message")
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where("receiverId = :me AND senderId = :other", {
          me: req.user.id,
          other: parseInt(userId),
        })
        .andWhere("read = false")
        .execute();
  
      res.json({ updated: result.affected });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "No se pudieron marcar como leídos" });
    }
  });

  router.delete("/with/:userId", authenticateToken, async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await dataSource
        .getRepository("Message")
        .createQueryBuilder()
        .delete()
        .where(
          "(senderId = :me AND receiverId = :other) OR (senderId = :other AND receiverId = :me)",
          { me: req.user.id, other: parseInt(userId) }
        )
        .execute();
  
      res.json({ deleted: result.affected });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error al borrar la conversación" });
    }
  });
  

  return router;
};

export default messageRoutes;
