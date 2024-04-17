/* 
import { Server } from 'socket.io';
import ProductManager from "../ProductManager.js"

export function initializeSocket(server) {
    const io = new Server(server);

    const productManager = new ProductManager();

    io.on('connection', async socket => {
        socket.on("conectionMessage", (data)=> {
            console.log(data, "(server side)");
        });

        const products = await productManager.getProducts();
        socket.emit("getProd", products);

        socket.on("info", async (productData) => {
            const { title, description, code, price, status, stock, category, thumbnail } = productData;
            const result = await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);
            if (result) {
                const products = await productManager.getProducts();
                socket.emit("info", products);
                console.log("Producto correctamente agregado.");
            }
        });

        socket.on("addMessage", (addMessage) => {
            console.log("Mensaje agregado", addMessage);
            io.emit("addedMessage", addMessage);
        });
    });
}
*/