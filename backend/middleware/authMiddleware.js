const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  console.log("AUTH HEADER:", header);

  if (!header) {
    return res.status(401).json({ error: "No token provided" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid token format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);

    if (!decoded.sub) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: decoded.sub };
    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
