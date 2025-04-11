import { EntitySchema } from "typeorm";

export const CartItem = new EntitySchema({
  name: "CartItem",
  tableName: "cart_items",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    addedAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      onDelete: "CASCADE",
      eager: true,
    },
    service: {
      type: "many-to-one",
      target: "Service",
      joinColumn: true,
      onDelete: "CASCADE",
      eager: true,
    },
  },
});
