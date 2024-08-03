import express from 'express';
import http from 'http';
//config
import config from './config.js';
//Logger
import logger from "../utils/logger-env.js";
//Dirname
import __dirname from '../dirname.js';

export default function createExpressApp() {
    const app = express();
    const port = config.port || 8081;
    const server = http.createServer(app);

    server.listen(port, () => logger.info(`Server running on port: ${port}`));

    return app;
}
