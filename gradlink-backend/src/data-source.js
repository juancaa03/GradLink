import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Service } from "./entities/Service.js";
import { Tag } from "./entities/Tag.js";
import { Order } from "./entities/Order.js";
import { Message } from "./entities/Message.js";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // IMPORTANTE
  migrations: ["src/migrations/*.js"],
  logging: false,
  entities: [User, Service, Tag, Order, Message],
});
