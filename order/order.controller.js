const { STRING_SUCCESS, STRING_FAILURE } = require("../utils/const-string.js");
const OrderStore = require("./order.store.js");

/**
 * Health check endpoint for load testing
 */
const controllerHealthCheck = async (req, res) => {
    try {
        return res.status(200).send({
            code: STRING_SUCCESS,
            message: "Order service is healthy",
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error("controllerHealthCheck err:", err);
        return res.status(500).send({
            code: STRING_FAILURE,
            message: "Health check failed",
        });
    }
};

/**
 * Controller to place an order and publish OrderPlacedEvent
 * Optimized for high-volume requests
 */
const controllerPlaceOrder = async (req, res) => {
    try {
        const body = req.body;

        // Validation
        if (!body.customerId || typeof body.customerId !== "string" || body.customerId.trim().length === 0) {
            return res.status(400).send({
                code: STRING_FAILURE,
                message: "ERROR: Invalid customerId",
            });
        }

        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            return res.status(400).send({
                code: STRING_FAILURE,
                message: "ERROR: Invalid items array",
            });
        }

        // Validate items structure
        for (const item of body.items) {
            if (!item.itemId || !item.name || !item.quantity || !item.price) {
                return res.status(400).send({
                    code: STRING_FAILURE,
                    message: "ERROR: Invalid item structure. Required: itemId, name, quantity, price",
                });
            }
        }

        // Calculate total amount
        const totalAmount = body.items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        // Prepare order data
        const objData = {
            customerId: String(body.customerId).trim(),
            items: body.items.map(item => ({
                itemId: String(item.itemId).trim(),
                name: String(item.name).trim(),
                quantity: Number(item.quantity),
                price: Number(item.price),
            })),
            totalAmount: totalAmount,
            currency: body.currency || "USD",
        };

        // Store order and publish event (non-blocking)
        const resp = await OrderStore.storePlaceOrder(objData);

        if (resp && resp.success) {
            return res.status(200).send({
                code: STRING_SUCCESS,
                message: "Order placed successfully",
                body: {
                    orderId: resp.orderId,
                    totalAmount: totalAmount,
                },
            });
        }

        return res.status(500).send({
            code: STRING_FAILURE,
            message: "ERROR: Failed to place order",
        });
    } catch (err) {
        console.error("controllerPlaceOrder err:", err);
        return res.status(500).send({
            code: STRING_FAILURE,
            message: "ERROR: Internal server error",
        });
    }
};

module.exports = {
    controllerPlaceOrder,
    controllerHealthCheck,
};

