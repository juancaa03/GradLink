import { EntitySchema } from "typeorm";

export const Order = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    status: {
      type: "varchar",
      default: "processing", // Otros valores posibles: "delivered", "cancelled"
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    }
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      eager: true,
      joinColumn: true
    },
    service: {
      type: "many-to-one",
      target: "Service",
      eager: true,
      joinColumn: true
    }
  }
});
