require("dotenv").config();
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const db = require("./db");
const logger = require("./logger");

const app = express();
const authMiddleware = require("./auth");

app.use(express.json());

app.get("/me", authMiddleware, (req, res) => {
  res.json({ userId: req.userId });
});


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const [users] = await db.query(
      "SELECT id, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // simple password check (for assignment)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = uuidv4();

    await db.query(
      "INSERT INTO tokens (user_id, token) VALUES (?, ?)",
      [user.id, token]
    );

    // log login event (JSON)
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
