const OrderData = require("./order.data.js");
const { getNatsClient } = require("../messaging/nats-client.js");
const OrderPlacedEvent = require("../dto/OrderPlacedEvent.js");
const { v4: uuidv4 } = require("uuid");

class OrderStore {
    /**
     * Store order and publish event to messaging system
     * Optimized for high throughput with async event publishing
     */
    static storePlaceOrder = async (objData) => {
        try {
            // Generate unique order ID
            const orderId = uuidv4();

            // Create event DTO
            const event = new OrderPlacedEvent({
                orderId: orderId,
                customerId: objData.customerId,
                items: objData.items,
                totalAmount: objData.totalAmount,
                currency: objData.currency,
            });

            // Validate event
            if (!event.validate()) {
                return { success: false, error: "Invalid event data" };
            }

            // Publish event asynchronously (non-blocking)
            // This allows the API to respond quickly even under high load
            const natsClient = getNatsClient();

            // Fire and forget - don't wait for publish confirmation for better performance
            natsClient.publish("order.placed", event.toJSON()).catch((err) => {
                console.error("Failed to publish event (non-critical):", err);
                // In production, you might want to retry or use a dead letter queue
            });

            // Log order creation (optional, can be removed for even better performance)
            await OrderData.dataLogOrderCreation({
                orderId: orderId,
                customerId: objData.customerId,
                totalAmount: objData.totalAmount,
            });

            return {
                success: true,
                orderId: orderId,
            };
        } catch (e) {
            console.error("storePlaceOrder error:", e);
            return { success: false, error: e.message };
        }
    };
}

module.exports = OrderStore;

