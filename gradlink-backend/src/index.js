import express from 'express';

require("dotenv").config();
const cors = require("cors");
const { DataSource } = require("typeorm"); // Para crear conexión con la base de datos
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// app.use("/api/users", require("./routes/user.routes"))

app.get('/', (req, res) => {
  res.json("Gradlink API is running 🚀")
})

app.listen(port, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`)
})