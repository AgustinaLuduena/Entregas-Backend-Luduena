//Manager
import ProductManager from "../../ProductManager.js";
import socketServer from "../../config/createSocket.js";
//Logger
import logger from "../../utils/logger-env.js";

const productManager = new ProductManager();

socketServer.on('connection', async socket =>{

    socket.on("conectionMessage", (data)=> {
        logger.info(data, "(server side)")
    });

    //List of produducts
    const products = await productManager.getProducts();
    socket.emit("getProd", products);

    socket.on("info", async (productData) => {
        const { title, description, code, price, status, stock, category, thumbnail } = productData;
        const result = await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);
        if (result) {
            const products = await productManager.getProducts();
            socket.emit("info", products);
            logger.info("Producto correctamente agregado.")
        }
    });

    socket.on("addMessage", (addMessage) => {
        logger.info("Mensaje agregado", addMessage);
        socketServer.emit("addedMessage", addMessage);
    })

})