module.exports = {
    type: "postgres", // Usamos PostgreSQL
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // Crea las tablas automáticamente en desarrollo
    logging: false, // Si lo pones true, muestra las consultas SQL
    entities: ["src/entities/*.js"], // Ubicación de tus modelos/entidades
  };
  