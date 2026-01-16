const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const auth = require("../middleware/authMiddleware");
const fetch = require("node-fetch");

const router = express.Router();

router.use(auth);

// Score prompts using ML service
router.post("/score", async (req, res) => {
  try {
    const { prompts } = req.body;
    
    if (!prompts || !Array.isArray(prompts)) {
      return res.status(400).json({ error: "prompts array is required" });
    }

    const mlPort = process.env.ML_PORT || 5001;
    const mlUrl = `http://localhost:${mlPort}/score`;

    const response = await fetch(mlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompts })
    });

    if (!response.ok) {
      throw new Error(`ML service responded with ${response.status}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("ML scoring error:", error.message);
    res.status(500).json({ 
      error: "ML scoring failed", 
      details: error.message 
    });
  }
});

router.post("/train", async (req, res) => {
  try {
    const projectRoot = path.resolve(__dirname, "..", "..");
    const mlDir = path.join(projectRoot, "ml");
    const script = path.join(mlDir, "train_reward_model.py");

    const py = process.env.PYTHON_BIN || "python";

    const child = spawn(py, [script], {
      cwd: mlDir,
      windowsHide: true
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: "ML training failed",
          code,
          details: stderr || stdout
        });
      }
      return res.json({ ok: true, output: stdout.trim() });
    });
  } catch (err) {
    console.error("ML train route error:", err);
    res.status(500).json({ error: "ML training failed" });
  }
});

module.exports = router;
