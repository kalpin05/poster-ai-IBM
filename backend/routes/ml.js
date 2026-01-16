const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(auth);

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
