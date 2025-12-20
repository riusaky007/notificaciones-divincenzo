const { connect } = require("nats");

class NatsClient {
    constructor() {
        this.nc = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            // Optimized connection for high throughput
            this.nc = await connect({
                servers: process.env.NATS_URL || "nats://localhost:4222",
                reconnect: true,
                maxReconnectAttempts: -1, // Infinite reconnects
                reconnectTimeWait: 2000,
                pingInterval: 20000,
                maxPingOut: 5,
                // Performance optimizations
                noEcho: false,
                preserveBuffers: false,
            });

            this.isConnected = true;
            console.log("✅ Connected to NATS server");

            // Handle connection events
            this.nc.closed().then(() => {
                console.log("❌ NATS connection closed");
                this.isConnected = false;
            });

            return this.nc;
        } catch (err) {
            console.error("❌ Error connecting to NATS:", err);
            throw err;
        }
    }

    async publish(subject, data) {
        if (!this.isConnected || !this.nc) {
            throw new Error("NATS client not connected");
        }

        try {
            const payload = JSON.stringify(data);
            this.nc.publish(subject, payload);
            return true;
        } catch (err) {
            console.error("❌ Error publishing to NATS:", err);
            throw err;
        }
    }

    async subscribe(subject, callback) {
        if (!this.isConnected || !this.nc) {
            throw new Error("NATS client not connected");
        }

        try {
            const sub = this.nc.subscribe(subject, {
                callback: (err, msg) => {
                    if (err) {
                        console.error("❌ Error in subscription callback:", err);
                        return;
                    }
                    try {
                        const data = JSON.parse(msg.data);
                        callback(data, msg);
                    } catch (parseErr) {
                        console.error("❌ Error parsing message:", parseErr);
                    }
                },
            });

            console.log(`✅ Subscribed to ${subject}`);
            return sub;
        } catch (err) {
            console.error("❌ Error subscribing to NATS:", err);
            throw err;
        }
    }

    async close() {
        if (this.nc) {
            await this.nc.close();
            this.isConnected = false;
        }
    }
}

// Singleton instance for high-performance connection reuse
let natsClientInstance = null;

const getNatsClient = () => {
    if (!natsClientInstance) {
        natsClientInstance = new NatsClient();
    }
    return natsClientInstance;
};

module.exports = { NatsClient, getNatsClient };

