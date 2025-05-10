import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const serviceRoutes = (dataSource) => {
  const router = express.Router();
  const serviceRepo = dataSource.getRepository("Service");
  const tagRepo = dataSource.getRepository("Tag");

  // Crear un nuevo servicio (solo logueados)
  router.post(
    "/",
    authenticateToken,
    async (req, res) => {
      if (req.user.role === "client") {
        return res
          .status(403)
          .json({ error: "Forbidden: no tienes permiso para crear servicios" });
      }

      const { title, description, price, tags = [], location } = req.body;
      const user = await dataSource.getRepository("User").findOneBy({ id: req.user.id });
      if (!user) return res.status(404).json({ error: "User not found" });

      const processedTags = [];
      for (const tag of tags) {
        const name = tag.name.toLowerCase().trim();
        let existing = await tagRepo.findOneBy({ name });
        if (!existing) existing = await tagRepo.save({ name });
        processedTags.push(existing);
      }

      const newService = serviceRepo.create({
        title,
        description,
        price,
        location,
        user,
        tags: processedTags
      });
      const saved = await serviceRepo.save(newService);
      res.status(201).json(saved);
    }
  );

  // Listar servicios con filtros dinámicos
  router.get("/", async (req, res) => {
    const { q, tags, minPrice, maxPrice, location, user } = req.query;

    const query = serviceRepo
      .createQueryBuilder("service")
      .leftJoinAndSelect("service.user", "user")
      .leftJoinAndSelect("service.tags", "tag");

    if (q) {
      const lowerQ = `%${q.toLowerCase()}%`;
      query.andWhere(
        `(LOWER(service.title) LIKE :q OR LOWER(service.description) LIKE :q)`,
        { q: lowerQ }
      );
    }

    if (minPrice) {
      query.andWhere("service.price >= :minPrice", { minPrice });
    }
    if (maxPrice) {
      query.andWhere("service.price <= :maxPrice", { maxPrice });
    }

    if (location) {
      query.andWhere("LOWER(service.location) LIKE :location", { location: `%${location.toLowerCase()}%` });
    }

    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim().toLowerCase());
      if (tagList.length > 0) {
        query.andWhere("LOWER(tag.name) IN (:...tagList)", { tagList });
      }
    }

    if (user) {
      const lowerUser = `%${user.toLowerCase()}%`;
      query.andWhere("LOWER(user.name) LIKE :lowerUser", { lowerUser });
    }

    const results = await query.getMany();
    res.json(results);
  });

  // Obtener servicios propios
  router.get("/my-services", authenticateToken, async (req, res) => {
    try {
      const user = await dataSource.getRepository("User").findOneBy({ id: req.user.id });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      const services = await serviceRepo.find({
        where: { user: { id: user.id } },
        relations: ["tags"],
      });
      res.json(services);
    } catch (err) {
      console.error("Error al obtener los servicios del usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Actualizar servicio existente
  router.put("/:id", authenticateToken, async (req, res) => {
    const { title, description, price, tags = [], location } = req.body;
    const serviceId = parseInt(req.params.id);

    const service = await serviceRepo.findOne({
      where: { id: serviceId },
      relations: ["user", "tags"],
    });
    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });
    if (service.user.id !== req.user.id) {
      return res.status(403).json({ error: "No autorizado para editar este servicio" });
    }

    service.title = title;
    service.description = description;
    service.price = price;
    service.location = location;

    const processedTags = [];
    for (const tag of tags) {
      const name = tag.name.toLowerCase().trim();
      let existing = await tagRepo.findOneBy({ name });
      if (!existing) existing = await tagRepo.save({ name });
      processedTags.push(existing);
    }
    service.tags = processedTags;

    const updated = await serviceRepo.save(service);
    res.json(updated);
  });

  // Obtener un servicio por id
  router.get("/:id", async (req, res) => {
    const service = await serviceRepo.findOneBy({ id: parseInt(req.params.id) });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  });

  return router;
};

export default serviceRoutes;
