// "use strict";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const http = require('http');

const AreaRouter = require('./area/area.router.js');

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

module.exports.start = async () => {
  try {
    server.listen(8929, () => {
      console.info(`server running at port: ${8929}`);
    });
  } catch (e) {
    console.error(e);
  }
};
