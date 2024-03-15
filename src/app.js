import express from 'express';
import __dirname from './utils.js';
import handlebars from "express-handlebars";
import { Server } from 'socket.io';
//Router
import viewsRouter from './routes/viewsRouter.js';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
//Manager
import ProductManager from "./ProductManager.js"


const app = express()
const port = 8080

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));


//Carpeta de vistas
app.set('views', `${__dirname}/views`);

//Motor de plantillas
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine());


//Routes
app.use(viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);


//.handlebars
const productManager = new ProductManager();

app.get('/', async (req, res) => {
    try {
      const productos = await productManager.getProducts();
      res.render('index', { productos: productos });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
  app.get('/realTimeProducts', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });


//Instanciando socket.io
const serverHTTP = app.listen(port, ()=> console.log("Server running on port: ", port));
const io = new Server(serverHTTP)


io.on('connection', async socket =>{

    socket.on("message", (data)=> {
        console.log(data, "(server side)")
    });

    //Lis of produducts
    const products = await productManager.getProducts();
    socket.emit("getProd", products);

    socket.on("info", async (productData) => {
        const { title, description, code, price, status, stock, category, thumbnail } = productData;
        const result = await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);
        if (result) {
            const products = await productManager.getProducts();
            socket.emit("info", products);
            console.log("Producto correctamente agregado.")
        }
    });

})
