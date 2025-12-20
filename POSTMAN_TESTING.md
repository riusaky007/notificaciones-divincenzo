# Postman Testing Guide

This guide explains how to test the Order Notification System using Postman, including single requests and high-volume load testing.

## Prerequisites

1. **Server Running**: Make sure the main API server is running
   ```bash
   npm start
   ```
   Server should be running on `http://localhost:8929`

2. **NATS Server Running**: NATS must be running for events to work
   ```bash
   nats-server
   ```

3. **Notification Consumer Running** (optional, for testing notifications):
   ```bash
   node notification/index.js
   ```

## API Endpoints

### Base URL
```
http://localhost:8929
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/order/health` | Health check endpoint |
| POST | `/api/order/place-order` | Place a new order (triggers event) |

---

## Setting Up Postman

### 1. Create a New Collection

1. Open Postman
2. Click **"New"** → **"Collection"**
3. Name it: `Order Notification System`
4. Click **"Create"**

### 2. Create Health Check Request

1. Click **"Add Request"** in your collection
2. Name it: `Health Check`
3. Set method to: **GET**
4. Enter URL: `http://localhost:8929/api/order/health`
5. Click **"Send"**

**Expected Response:**
```json
{
  "code": "SUCCESS",
  "message": "Order service is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Create Place Order Request

1. Click **"Add Request"** in your collection
2. Name it: `Place Order`
3. Set method to: **POST**
4. Enter URL: `http://localhost:8929/api/order/place-order`
5. Go to **"Headers"** tab:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **"Body"** tab:
   - Select **"raw"**
   - Select **"JSON"** from dropdown
   - Paste the following JSON:

```json
{
  "customerId": "customer-123",
  "items": [
    {
      "itemId": "item-1",
      "name": "Product A",
      "quantity": 2,
      "price": 29.99
    },
    {
      "itemId": "item-2",
      "name": "Product B",
      "quantity": 1,
      "price": 49.99
    }
  ],
  "currency": "USD"
}
```

7. Click **"Send"**

**Expected Response:**
```json
{
  "code": "SUCCESS",
  "message": "Order placed successfully",
  "body": {
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "totalAmount": 109.97
  }
}
```

---

## Testing Scenarios

### Scenario 1: Valid Order Request

**Request:**
```json
{
  "customerId": "customer-001",
  "items": [
    {
      "itemId": "item-001",
      "name": "Laptop",
      "quantity": 1,
      "price": 999.99
    }
  ],
  "currency": "USD"
}
```

**Expected:** Status 200, orderId returned

### Scenario 2: Multiple Items

**Request:**
```json
{
  "customerId": "customer-002",
  "items": [
    {
      "itemId": "item-001",
      "name": "Product A",
      "quantity": 3,
      "price": 10.00
    },
    {
      "itemId": "item-002",
      "name": "Product B",
      "quantity": 2,
      "price": 15.50
    },
    {
      "itemId": "item-003",
      "name": "Product C",
      "quantity": 1,
      "price": 25.00
    }
  ],
  "currency": "USD"
}
```

**Expected:** Status 200, totalAmount = 91.00

### Scenario 3: Invalid Request - Missing customerId

**Request:**
```json
{
  "items": [
    {
      "itemId": "item-001",
      "name": "Product A",
      "quantity": 1,
      "price": 10.00
    }
  ]
}
```

**Expected:** Status 400, error message about invalid customerId

### Scenario 4: Invalid Request - Empty Items Array

**Request:**
```json
{
  "customerId": "customer-003",
  "items": []
}
```

**Expected:** Status 400, error message about invalid items array

### Scenario 5: Invalid Request - Missing Item Fields

**Request:**
```json
{
  "customerId": "customer-004",
  "items": [
    {
      "itemId": "item-001",
      "name": "Product A"
      // Missing quantity and price
    }
  ]
}
```

**Expected:** Status 400, error message about invalid item structure

---

## Load Testing with Postman Collection Runner

### Step 1: Prepare Dynamic Data

Update your "Place Order" request body to use dynamic variables:

```json
{
  "customerId": "customer-{{$randomInt}}",
  "items": [
    {
      "itemId": "item-{{$randomInt}}",
      "name": "Product {{$randomInt}}",
      "quantity": {{$randomInt}},
      "price": {{$randomFloat}}
    },
    {
      "itemId": "item-{{$randomInt}}",
      "name": "Product {{$randomInt}}",
      "quantity": {{$randomInt}},
      "price": {{$randomFloat}}
    }
  ],
  "currency": "USD"
}
```

**Postman Dynamic Variables:**
- `{{$randomInt}}` - Random integer
- `{{$randomFloat}}` - Random float
- `{{$timestamp}}` - Current timestamp
- `{{$guid}}` - Random GUID

### Step 2: Configure Collection Runner

1. Click on your collection name
2. Click **"Run"** button (or right-click → **"Run collection"**)
3. In the Collection Runner window:

   **Settings:**
   - **Iterations**: `1000` (or your desired number)
   - **Delay**: `0` (for maximum throughput)
   - **Data**: Leave empty (using dynamic variables)
   - **Stop on error**: Unchecked (to continue even if some fail)

4. Click **"Run Order Notification System"**

### Step 3: Monitor Results

**In Postman:**
- Watch the progress bar
- Check success/failure counts
- Review response times
- Check for any errors

**In Server Terminal:**
- Watch for order creation logs: `[ORDER_CREATED] ...`
- Monitor response times
- Check for any errors

**In Notification Consumer Terminal** (if running):
- Watch for processing logs:
  - `💾 [DATABASE] Order processing info stored into database...`
  - `📧 [NOTIFICATION] Notification sent to customer...`
- Check statistics every 30 seconds: `📊 Consumer Stats: X processed, Y errors`

### Step 4: Analyze Results

After the run completes:

1. **Check Success Rate**: Should be close to 100% if server is healthy
2. **Check Average Response Time**: Should be < 50ms for optimal performance
3. **Check Error Types**: Review any 400/500 errors
4. **Verify Events**: Check notification consumer logs to verify events were processed

---

## Advanced Testing

### Using Pre-request Scripts

Add a pre-request script to generate more realistic data:

1. Select your "Place Order" request
2. Go to **"Pre-request Script"** tab
3. Add:

```javascript
// Generate random customer ID
pm.environment.set("customerId", "customer-" + Math.floor(Math.random() * 10000));

// Generate random item count (1-5 items)
const itemCount = Math.floor(Math.random() * 5) + 1;
pm.environment.set("itemCount", itemCount);
```

4. Update body to use environment variables:

```json
{
  "customerId": "{{customerId}}",
  "items": [
    {
      "itemId": "item-{{$randomInt}}",
      "name": "Product {{$randomInt}}",
      "quantity": {{$randomInt}},
      "price": {{$randomFloat}}
    }
  ],
  "currency": "USD"
}
```

### Using Tests (Assertions)

Add tests to verify responses:

1. Go to **"Tests"** tab in your request
2. Add:

```javascript
// Test response status
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response structure
pm.test("Response has orderId", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.body).to.have.property('orderId');
    pm.expect(jsonData.code).to.eql('SUCCESS');
});

// Test response time
pm.test("Response time is less than 100ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(100);
});
```

---

## Troubleshooting

### Issue: Connection Refused

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:8929`

**Solution:**
- Verify server is running: `npm start`
- Check if port 8929 is available
- Verify no firewall blocking the port

### Issue: NATS Connection Failed

**Error:** `NATS connection failed` in server logs

**Solution:**
- Start NATS server: `nats-server`
- Verify NATS is running on port 4222
- Check NATS server logs

### Issue: Events Not Being Processed

**Symptoms:** Orders created but no notification logs

**Solution:**
- Start notification consumer: `node notification/index.js`
- Verify NATS connection in consumer logs
- Check for errors in consumer terminal

### Issue: Slow Response Times

**Symptoms:** Response times > 200ms

**Possible Causes:**
- High server load
- NATS server overloaded
- Network issues
- Too many concurrent requests

**Solution:**
- Reduce iteration delay
- Check server resources (CPU, memory)
- Monitor NATS server performance
- Consider scaling

### Issue: 400 Bad Request

**Common Causes:**
- Missing required fields (customerId, items)
- Invalid item structure
- Empty items array
- Invalid data types

**Solution:**
- Review request body structure
- Ensure all required fields are present
- Validate data types match expected format

---

## Performance Benchmarks

### Expected Performance

| Metric | Target | Notes |
|--------|--------|-------|
| Response Time | < 50ms | For single requests |
| Throughput | 1000+ req/sec | With proper hardware |
| Success Rate | > 99% | Under normal load |
| Event Processing | < 100ms | From event to notification log |

### Monitoring Tips

1. **Watch Response Times**: Should remain consistent under load
2. **Monitor Error Rates**: Should stay below 1%
3. **Check Memory Usage**: Server should handle load without memory leaks
4. **Verify Event Processing**: All orders should trigger notifications

---

## Example Postman Collection JSON

You can import this collection directly into Postman:

```json
{
  "info": {
    "name": "Order Notification System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8929/api/order/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8929",
          "path": ["api", "order", "health"]
        }
      }
    },
    {
      "name": "Place Order",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"customerId\": \"customer-{{$randomInt}}\",\n  \"items\": [\n    {\n      \"itemId\": \"item-{{$randomInt}}\",\n      \"name\": \"Product {{$randomInt}}\",\n      \"quantity\": {{$randomInt}},\n      \"price\": {{$randomFloat}}\n    }\n  ],\n  \"currency\": \"USD\"\n}"
        },
        "url": {
          "raw": "http://localhost:8929/api/order/place-order",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8929",
          "path": ["api", "order", "place-order"]
        }
      }
    }
  ]
}
```

---

## Quick Start Checklist

- [ ] Server running on port 8929
- [ ] NATS server running on port 4222
- [ ] Notification consumer running (optional)
- [ ] Postman collection created
- [ ] Health check request works
- [ ] Place order request works
- [ ] Load test configured (1000+ iterations)
- [ ] Monitoring terminals for logs

---

**Happy Testing! 🚀**

