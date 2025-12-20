# Notification System Documentation

This project now includes an event-driven notification system following the same structure as the `area` folder.

## Project Structure

```
api-test/
├── area/                    # Existing area module
├── order/                   # Order Service (Event Producer)
│   ├── order.router.js     # Routes
│   ├── order.controller.js # Request handling
│   ├── order.store.js      # Business logic & event publishing
│   └── order.data.js       # Data layer
├── notification/           # Notification Service (Event Consumer)
│   ├── notification.consumer.js # Event consumer
│   ├── notification.store.js    # Business logic
│   ├── notification.data.js    # Console logging
│   └── index.js           # Consumer service entry point
├── messaging/
│   └── nats-client.js     # NATS messaging client
├── dto/
│   └── OrderPlacedEvent.js # Event DTO
└── server.js              # Main server (includes OrderRouter)
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install `nats` package (uuid is already installed).

### 2. Start NATS Server

**macOS:**
```bash
brew install nats-server
nats-server
```

**Linux/Docker:**
```bash
docker run -p 4222:4222 -ti nats:latest
```

### 3. Start Services

**Terminal 1 - Main API Server (includes Order Service):**
```bash
npm start
```

The server will start on port 8929 and include:
- `/api/area/*` - Existing area endpoints
- `/api/order/*` - New order endpoints

**Terminal 2 - Notification Consumer Service:**
```bash
node notification/index.js
```

## API Endpoints

### Place Order
```http
POST http://localhost:8929/api/order/place-order
Content-Type: application/json

{
  "customerId": "customer-123",
  "items": [
    {
      "itemId": "item-1",
      "name": "Product A",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "currency": "USD"
}
```

### Health Check
```http
GET http://localhost:8929/api/order/health
```

## Load Testing with Postman

1. Create a POST request to `http://localhost:8929/api/order/place-order`
2. Use Collection Runner with 1000+ iterations
3. Monitor both terminals:
   - Main server: Order creation logs
   - Notification service: `💾 [DATABASE]` and `📧 [NOTIFICATION]` logs

## How It Works

1. **Order Request** → `POST /api/order/place-order`
2. **Order Controller** → Validates request
3. **Order Store** → Creates event and publishes to NATS
4. **NATS Broker** → Queues the event
5. **Notification Consumer** → Receives event
6. **Notification Store** → Processes event
7. **Console Logs** → Shows database storage and notification sending

The system is optimized for high-volume requests with non-blocking event publishing.

