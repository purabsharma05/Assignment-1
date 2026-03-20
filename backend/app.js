require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const PORT = 3000;

// DB connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// TEST LOG (important)
console.log("Server file loaded");

// Create table
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT
  )
`);

// ROUTES 👇👇👇

// health
app.get("/health", (req, res) => {
  res.send("Server is running ✅");
});

// users GET
app.get("/users", async (req, res) => {
  console.log("GET /users hit");
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

// users POST
app.post("/users", async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    "INSERT INTO users (name) VALUES ($1) RETURNING *",
    [name]
  );
  res.json(result.rows[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});