/**
 * Order Data Layer
 * Lightweight logging for order creation
 * Optimized for high-volume writes
 */
class OrderData {
  /**
   * Log order creation (optional, for monitoring)
   * In high-volume scenarios, this could be async or removed
   */
  static dataLogOrderCreation = async (objData) => {
    try {
      // Lightweight logging - just console for performance
      // In production, you might use a separate async logging service
      console.log(`[ORDER_CREATED] ${objData.orderId} | Customer: ${objData.customerId} | Amount: ${objData.totalAmount}`);
      return true;
    } catch (err) {
      console.error("dataLogOrderCreation err:", err);
      return false;
    }
  };
}

module.exports = OrderData;

