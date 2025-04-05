import { EntitySchema } from "typeorm";

export const Tag = new EntitySchema({
  name: "Tag",
  tableName: "tags",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      unique: true,
    },
  },
  relations: {
    services: {
      type: "many-to-many",
      target: "Service",
      mappedBy: "tags",
    },
  },
});
