import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      unique: true,
    },
    institutionalEmail: {
      type: "varchar",
      unique: true,
      nullable: true,
    },
    institutionalEmailVerified: {
      type: "boolean",
      default: false,
    },
    password: {
      type: "varchar",
    },
    role: {
      type: "varchar", // student | client | admin
      default: "client",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
});
