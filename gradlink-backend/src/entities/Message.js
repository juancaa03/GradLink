import { EntitySchema } from "typeorm";

export const Message = new EntitySchema({
  name: "Message",
  tableName: "messages",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    content: {
      type: "text",
    },
    timestamp: {
      type: "timestamp",
      createDate: true,
    },
    read: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    sender: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
    },
    receiver: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
    },
    service: {
      type: "many-to-one",
      target: "Service",
      joinColumn: true,
      eager: true,
      nullable: true,
    },
  },
});
