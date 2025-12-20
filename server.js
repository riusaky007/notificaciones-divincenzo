// "use strict";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const http = require('http');

const AreaRouter = require('./area/area.router.js');
const OrderRouter = require('./order/order.router.js');
const { getNatsClient } = require('./messaging/nats-client.js');

const app = express();

const server = http.createServer(app);

app.use(useragent.express());
app.use(helmet());
app.disable('x-powered-by');
app.use(
  cors({
    origin: [
      'http://localhost:3000',
    ],
  })
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/area', AreaRouter);
app.use('/api/order', OrderRouter);

module.exports.start = async () => {
  try {
    // Initialize NATS connection for event-driven architecture
    // Try to connect, but don't block server startup if it fails
    // The publish method will attempt to reconnect when needed
    const natsClient = getNatsClient();
    natsClient.connect().then(() => {
      console.info('✅ NATS connection initialized');
    }).catch((natsErr) => {
      console.warn('⚠️  NATS connection failed on startup (will retry on first publish):', natsErr.message);
      console.warn('⚠️  Make sure NATS server is running: nats-server');
      console.warn('⚠️  The server will continue, but order events will fail until NATS is available');
    });

    server.listen(8929, () => {
      console.info(`server running at port: ${8929}`);
      console.info(`📡 Order API available at: http://localhost:8929/api/order/place-order`);
    });
  } catch (e) {
    console.error(e);
  }
};
