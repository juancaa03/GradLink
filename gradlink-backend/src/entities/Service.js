import { EntitySchema } from "typeorm";

export const Service = new EntitySchema({
  name: "Service",
  tableName: "services",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "text",
    },
    price: {
      type: "decimal",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
    },
    tags: {
      type: "many-to-many",
      target: "Tag",
      joinTable: true,
      cascade: true,
      eager: true,
    },
  },
});
