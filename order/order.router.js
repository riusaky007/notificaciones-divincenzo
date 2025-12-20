const { Router } = require("express");
const {
    controllerPlaceOrder,
    controllerHealthCheck,
} = require("./order.controller.js");

const OrderRouter = Router();

// Health check endpoint for load testing
OrderRouter.route("/health").get(controllerHealthCheck);

// Main endpoint to place an order (triggers event)
OrderRouter.route("/place-order").post(controllerPlaceOrder);

module.exports = OrderRouter;

