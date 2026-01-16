const app = require("./app");
const mlService = require("./services/mlService");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Start ML service first
    await mlService.start();
    
    // Then start the backend server
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
      console.log(`ML service integrated and running on port ${process.env.ML_PORT || 5001}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await mlService.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await mlService.stop();
  process.exit(0);
});

startServer();
