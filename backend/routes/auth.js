const express = require('express');
const jwt = require('jsonwebtoken');
const { User, sequelize } = require('../models');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    console.log("SIGNUP BODY:", req.body);

    const { email, password, name } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ error: "Missing email or password" });
    }

    const existing = await User.findOne({
      where: sequelize.where(
        sequelize.fn("lower", sequelize.col("email")),
        email.toLowerCase()
      )
    });

    if (existing) {
      console.log("Email already exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = await User.create({ email, password, name });

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: sequelize.where(sequelize.fn('lower', sequelize.col('email')), email.toLowerCase())
    });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;