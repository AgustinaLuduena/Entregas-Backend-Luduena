import express from 'express';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import config from './config.js';

export default function createExpressApp() {
    const app = express();
    const port = config.port;
    const server = http.createServer(app);
    const io = new SocketServer(server);

    // Servir el cliente de Socket.IO desde un endpoint específico - Solución error con la línea de conexión de realTimeProducts.handlebars
    app.get('/socket.io/socket.io.js', (req, res) => {
        res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
    });

    server.listen(port, () => console.log("Server running on port: ", port));

    return app;
}
