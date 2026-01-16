const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { Poster } = require("../models");
const fetch = require("node-fetch");

// Make routes public so teachers can view project without logging in
// router.use(auth);

// In-memory store for unauthenticated users (cleared on server restart)
const tempPosters = new Map(); // key: sessionId, value: array of posters

/**
 * Warm up Pollinations image
 * This forces Pollinations to generate + cache the image
 * before frontend tries to render it.
 */
async function warmUpImage(imageUrl) {
  try {
    // GET request triggers generation
    await fetch(imageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
  } catch (err) {
    // Best-effort warm-up; ignore failures
    console.error("Image warm-up failed:", err.message);
  }
}

/**
 * GET /posters
 */
router.get("/", async (req, res) => {
  try {
    if (req.user) {
      // Authenticated: fetch from DB
      const posters = await Poster.findAll({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]]
      });
      res.json({ posters });
    } else {
      // Unauthenticated: return in-memory posters for this session
      const sessionId = req.ip || 'anonymous';
      const posters = tempPosters.get(sessionId) || [];
      res.json({ posters });
    }
  } catch (err) {
    console.error("List posters error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /posters
 */
router.post("/", async (req, res) => {
  try {
    const { prompt, title } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // 🔴 DO NOT MODIFY USER PROMPT
    const userPrompt = prompt.trim();

    // Legacy Pollinations URL (supports long prompts)
    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(userPrompt)}`;

    // 🔥 CRITICAL FIX: warm up image before returning it
    await warmUpImage(imageUrl);

    // Only persist if user is authenticated; otherwise store in memory
    if (!req.user) {
      const sessionId = req.ip || 'anonymous'; // simple session key
      const tempPoster = {
        id: Date.now(),
        prompt: userPrompt,
        title: title || "My Poster",
        imageUrl
      };
      if (!tempPosters.has(sessionId)) {
        tempPosters.set(sessionId, []);
      }
      tempPosters.get(sessionId).push(tempPoster);
      return res.status(201).json({ poster: tempPoster });
    }

    const poster = await Poster.create({
      userId: req.user.id,
      title: title || "My Poster",
      prompt: userPrompt,
      imageUrl,
      fallbackUrl: null
    });

    res.status(201).json({ poster });
  } catch (err) {
    console.error("Create poster error:", err);
    console.error("DB error:", err?.original);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /posters/:id - remove a poster (admin cleanup for orphaned records)
router.delete("/:id", async (req, res) => {
  try {
    const poster = await Poster.findByPk(req.params.id);
    if (!poster) return res.status(404).json({ error: "Poster not found" });

    await poster.destroy();
    res.json({ message: "Poster deleted" });
  } catch (err) {
    console.error("Delete poster error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
