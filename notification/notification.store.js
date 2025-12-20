const NotificationData = require("./notification.data.js");

class NotificationStore {
    /**
     * Log order processing to database
     */
    static storeLogOrderProcessing = async (event) => {
        try {
            const objData = {
                orderId: event.orderId,
                customerId: event.customerId,
                totalAmount: event.totalAmount,
                itemCount: event.items.length,
                timestamp: event.timestamp,
            };

            const resp = await NotificationData.dataLogOrderProcessing(objData);
            return resp;
        } catch (e) {
            console.error("storeLogOrderProcessing error:", e);
            return false;
        }
    };

    /**
     * Generate notification message (simulating email/SMS)
     */
    static storeGenerateNotification = async (event) => {
        try {
            const objData = {
                orderId: event.orderId,
                customerId: event.customerId,
                totalAmount: event.totalAmount,
                currency: event.currency,
                items: event.items,
            };

            const resp = await NotificationData.dataGenerateNotification(objData);
            return resp;
        } catch (e) {
            console.error("storeGenerateNotification error:", e);
            return false;
        }
    };
}

module.exports = NotificationStore;

