const db = require("./db");

async function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid Authorization format" });
  }

  const token = parts[1].trim();

  try {
    const [rows] = await db.query(
      "SELECT user_id FROM tokens WHERE token = ?",
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.userId = rows[0].user_id;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = authMiddleware;
