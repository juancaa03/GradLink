import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const serviceRoutes = (dataSource) => {
  const router = express.Router();
  const serviceRepo = dataSource.getRepository("Service");
  const tagRepo = dataSource.getRepository("Tag");

  // Crear un nuevo servicio (solo logueados)
  router.post("/", authenticateToken, async (req, res) => {
    const { title, description, price, tags = [] } = req.body;
    const user = await dataSource.getRepository("User").findOneBy({ id: req.user.id });

    if (!user) return res.status(404).json({ error: "User not found" });

    const processedTags = [];
    for (const tag of tags) {
      const name = tag.name.toLowerCase().trim();
      let existing = await tagRepo.findOneBy({ name });
      if (!existing) existing = await tagRepo.save({ name });
      processedTags.push(existing);
    }

    const newService = serviceRepo.create({ title, description, price, user, tags: processedTags });
    const saved = await serviceRepo.save(newService);
    res.status(201).json(saved);
  });

  router.get("/", async (req, res) => {
    const { q, tags } = req.query;

    const query = serviceRepo
      .createQueryBuilder("service")
      .leftJoinAndSelect("service.user", "user")
      .leftJoinAndSelect("service.tags", "tag");

    if (q) {
      query.andWhere("LOWER(service.title) LIKE :q", { q: `%${q.toLowerCase()}%` });
    }

    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim().toLowerCase());
      if (tagList.length > 0) {
        query.andWhere("LOWER(tag.name) IN (:...tagList)", { tagList });
      }
    }

    const results = await query.getMany();
    res.json(results);
  });

  router.get("/:id", async (req, res) => {
    const service = await serviceRepo.findOneBy({ id: parseInt(req.params.id) });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  });

  return router;
};

export default serviceRoutes;
