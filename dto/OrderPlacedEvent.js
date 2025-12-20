/**
 * OrderPlacedEvent DTO
 * Generated using AI assistance for schema definition
 * 
 * This DTO represents the event structure for order placement notifications.
 * It follows a clear, serializable format for event-driven architecture.
 */
class OrderPlacedEvent {
    constructor({
        orderId,
        customerId,
        items = [],
        totalAmount,
        timestamp = new Date().toISOString(),
        currency = "USD",
    }) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.items = items; // Array of { itemId, name, quantity, price }
        this.totalAmount = totalAmount;
        this.timestamp = timestamp;
        this.currency = currency;
    }

    /**
     * Validates the event data
     * @returns {boolean} True if valid
     */
    validate() {
        if (!this.orderId || typeof this.orderId !== "string") {
            return false;
        }
        if (!this.customerId || typeof this.customerId !== "string") {
            return false;
        }
        if (!Array.isArray(this.items) || this.items.length === 0) {
            return false;
        }
        if (typeof this.totalAmount !== "number" || this.totalAmount <= 0) {
            return false;
        }
        return true;
    }

    /**
     * Converts to JSON for serialization
     * @returns {Object} JSON representation
     */
    toJSON() {
        return {
            orderId: this.orderId,
            customerId: this.customerId,
            items: this.items,
            totalAmount: this.totalAmount,
            timestamp: this.timestamp,
            currency: this.currency,
        };
    }

    /**
     * Creates from JSON
     * @param {Object} json - JSON object
     * @returns {OrderPlacedEvent} Event instance
     */
    static fromJSON(json) {
        return new OrderPlacedEvent(json);
    }
}

module.exports = OrderPlacedEvent;

