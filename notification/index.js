const NotificationConsumer = require("./notification.consumer.js");
const NotificationData = require("./notification.data.js");

/**
 * Notification Service - Event Consumer
 * Processes OrderPlacedEvent asynchronously
 */
const start = async () => {
  try {
    // Initialize database (simulated)
    console.log("📦 Initializing database...");
    await NotificationData.initializeDatabase();

    // Start consumer
    console.log("🚀 Starting Notification Consumer...");
    const consumer = new NotificationConsumer();
    await consumer.start();

    // Log statistics periodically
    setInterval(() => {
      const stats = consumer.getStats();
      console.log(`📊 Consumer Stats: ${stats.processed} processed, ${stats.errors} errors`);
    }, 30000); // Every 30 seconds

    console.log("✅ Notification Service is running and processing events...");
  } catch (err) {
    console.error("❌ Error starting Notification Service:", err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down Notification Service...");
  await NotificationData.closeDatabase();
  console.log("✅ Notification Service stopped");
  process.exit(0);
});

start();

