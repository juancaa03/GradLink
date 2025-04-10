import { User } from "./src/entities/User.js";
import { Service } from "./src/entities/Service.js";
import { Tag } from "./src/entities/Tag.js";
import { Order } from "./src/entities/Order.js";
import { Message } from "./src/entities/Message.js";

export default {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
  entities: [User, Service, Tag, Order, Message],
};
