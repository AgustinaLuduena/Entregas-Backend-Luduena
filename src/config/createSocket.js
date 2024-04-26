import { Server } from 'socket.io';

export default function socketServer(server){
    const io = new Server(server); // Pasar el servidor HTTP aquí en lugar de la aplicación Express

    return io;
}

