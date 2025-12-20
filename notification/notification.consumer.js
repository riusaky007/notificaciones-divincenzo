const { getNatsClient } = require("../messaging/nats-client.js");
const OrderPlacedEvent = require("../dto/OrderPlacedEvent.js");
const NotificationStore = require("./notification.store.js");

/**
 * Notification Consumer Service
 * Subscribes to OrderPlacedEvent and processes notifications asynchronously
 * Optimized for high-volume event processing
 */
class NotificationConsumer {
  constructor() {
    this.isProcessing = false;
    this.processedCount = 0;
    this.errorCount = 0;
  }

  /**
   * Start consuming events from NATS
   */
  async start() {
    try {
      const natsClient = getNatsClient();
      await natsClient.connect();

      // Subscribe to order.placed events
      await natsClient.subscribe("order.placed", async (data, msg) => {
        await this.handleOrderPlacedEvent(data);
      });

      console.log("✅ Notification Consumer started and listening for events...");
    } catch (err) {
      console.error("❌ Error starting notification consumer:", err);
      throw err;
    }
  }

  /**
   * Handle OrderPlacedEvent
   * Processes events asynchronously with error handling
   */
  async handleOrderPlacedEvent(data) {
    try {
      // Create event DTO from received data
      const event = OrderPlacedEvent.fromJSON(data);

      // Validate event
      if (!event.validate()) {
        console.error("❌ Invalid event received:", data);
        this.errorCount++;
        return;
      }

      // Process notification asynchronously
      // This allows handling multiple events concurrently
      this.processNotification(event).catch((err) => {
        console.error("❌ Error processing notification:", err);
        this.errorCount++;
      });

      this.processedCount++;
      
      // Log every 100 events for monitoring
      if (this.processedCount % 100 === 0) {
        console.log(`📊 Processed ${this.processedCount} events (${this.errorCount} errors)`);
      }
    } catch (err) {
      console.error("❌ Error handling OrderPlacedEvent:", err);
      this.errorCount++;
    }
  }

  /**
   * Process notification (log to console and generate notification message)
   */
  async processNotification(event) {
    try {
      // 1. Log order processing to database (simulated)
      await NotificationStore.storeLogOrderProcessing(event);

      // 2. Generate and log notification message (simulating email/SMS)
      await NotificationStore.storeGenerateNotification(event);

      // Success log
      console.log(`✅ Notification processed for Order ${event.orderId}`);
    } catch (err) {
      console.error(`❌ Error processing notification for Order ${event.orderId}:`, err);
      throw err;
    }
  }

  /**
   * Get consumer statistics
   */
  getStats() {
    return {
      processed: this.processedCount,
      errors: this.errorCount,
      isProcessing: this.isProcessing,
    };
  }
}

module.exports = NotificationConsumer;

