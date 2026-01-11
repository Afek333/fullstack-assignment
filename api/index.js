require("dotenv").config();
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const db = require("./db");
const logger = require("./logger");
const authMiddleware = require("./auth");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/me", authMiddleware, (req, res) => {
  res.json({ userId: req.userId });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const [users] = await db.query(
      "SELECT id, password FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // ⚠️ Plain-text password check (intentional for assignment)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = uuidv4();

    await db.query(
      "INSERT INTO tokens (user_id, token) VALUES (?, ?)",
      [user.id, token]
    );

    logger.info({
      timestamp: new Date().toISOString(),
      userId: user.id,
      action: "login",
      ip: req.ip
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("API running on port 3000");
});
