import express from 'express';
import __dirname from './utils.js';
import handlebars from "express-handlebars";
import { Server } from 'socket.io';
import mongoose from 'mongoose';
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

//MongoDB
const connectMongoDB = async () => {
  //127.0.0.1 es localhost
  const DB_URL = 'mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority'
  try{
      await mongoose.connect(DB_URL)
      console.log("Conected to MongoDB!")
  }catch(error){
      console.error("Error. You are not conected to the DB", error)
      process.exit()
  }
  }
  
  connectMongoDB()


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


//chat before MongoDB
//const msg = []



io.on('connection', async socket =>{

    socket.on("conectionMessage", (data)=> {
        console.log(data, "(server side)")
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
            console.log("Producto correctamente agregado.")
        }
    });

    //Chat
    /* 
    //chat before MongoDB
    socket.on("message", (msg)=> {
      console.log("Mensaje agregado", msg);
      //msg.push(data)
      io.emit('messageLogs', msg)
      
  })*/

  socket.on("addMessage", (addMessage) => {
    console.log("Mensaje agregado", addMessage);
    io.emit("addedMessage", addMessage);
})

})
