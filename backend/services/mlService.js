const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

class MLService {
  constructor() {
    this.pythonProcess = null;
    this.isReady = false;
    this.port = process.env.ML_PORT || 5001;
  }

  async start() {
    if (this.pythonProcess) {
      console.log("ML service already running");
      return;
    }

    const projectRoot = path.resolve(__dirname, "..", "..");
    const mlDir = path.join(projectRoot, "ml");
    const scriptPath = path.join(mlDir, "score_service.py");

    // Check if ML models exist in backend/models, copy them if needed
    await this.ensureModels();

    const py = process.env.PYTHON_BIN || "python";
    
    console.log(`Starting ML service on port ${this.port}...`);
    
    this.pythonProcess = spawn(py, [scriptPath], {
      cwd: mlDir,
      windowsHide: true,
      env: {
        ...process.env,
        FLASK_PORT: this.port
      }
    });

    this.pythonProcess.stdout.on("data", (data) => {
      console.log(`ML Service: ${data.toString().trim()}`);
      if (data.toString().includes("Running on")) {
        this.isReady = true;
        console.log("ML service is ready!");
      }
    });

    this.pythonProcess.stderr.on("data", (data) => {
      console.error(`ML Service Error: ${data.toString().trim()}`);
    });

    this.pythonProcess.on("close", (code) => {
      console.log(`ML service exited with code ${code}`);
      this.pythonProcess = null;
      this.isReady = false;
    });

    // Wait a bit for the service to start
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async ensureModels() {
    const modelsDir = path.resolve(__dirname, "..", "models");
    const vectorizerPath = path.join(modelsDir, "vectorizer.pkl");
    const modelPath = path.join(modelsDir, "reward_model.pkl");

    if (!fs.existsSync(vectorizerPath) || !fs.existsSync(modelPath)) {
      console.log("ML models not found in backend/models, copying from ml folder...");
      const mlDir = path.resolve(__dirname, "..", "..", "ml");
      
      if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
      }

      if (!fs.existsSync(vectorizerPath) && fs.existsSync(path.join(mlDir, "vectorizer.pkl"))) {
        fs.copyFileSync(path.join(mlDir, "vectorizer.pkl"), vectorizerPath);
      }
      
      if (!fs.existsSync(modelPath) && fs.existsSync(path.join(mlDir, "reward_model.pkl"))) {
        fs.copyFileSync(path.join(mlDir, "reward_model.pkl"), modelPath);
      }
    }
  }

  async stop() {
    if (this.pythonProcess) {
      this.pythonProcess.kill();
      this.pythonProcess = null;
      this.isReady = false;
      console.log("ML service stopped");
    }
  }

  isRunning() {
    return this.pythonProcess !== null && this.isReady;
  }
}

module.exports = new MLService();
