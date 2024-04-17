
import express from 'express';
import __dirname from './utils.js';
import handlebars from "express-handlebars";
import { Server } from 'socket.io';
import connectDb from './config/database.js';
import MongoStore from 'connect-mongo';
//import cookieParser from 'cookie-parser';
import session from 'express-session';
//Passport
import passport from 'passport';
import initializePassport from './config/passport.config.js';
//Router
import viewsRouter from './routes/viewsRouter.js';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import sessionsRouter from './routes/sessionsRouter.js';
//Manager
import ProductManager from "./ProductManager.js"




const app = express()
const port = 8080




//MongoDB
connectDb()

//Este código duplicado en "config" va a ser reemplazado por Varialbles de Entorno luego
const PASS_MONGO = "mongodb2024"
const DB_URL = `mongodb+srv://agusluduena4:${PASS_MONGO}@cluster0.egyfnzt.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
//app.use(cookieParser("signed"))
app.use(session({
  store: new MongoStore({
    mongoUrl: DB_URL,
    ttl: 5
  }),
  secret:"secret",
  resave: false,
  saveUninitialized: false
}))

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Carpeta de vistas
app.set('views', `${__dirname}/views`);

//Motor de plantillas
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine());


//Routes
app.use(viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);


//.handlebars
const productManager = new ProductManager();

  app.get('/realTimeProducts', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });

  /* 
  //PRIMERAS COOKIES - EJERCICIO DE CLASE

  app.get('/setCookie', (req, res) => {
    res.cookie("Primer cookie", "Esta es mi primera cookie",{maxAge: 1000000, signed: true}).send("Nueva cookie")
  });
  app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
  });
  */

  //Session Counter - EJERCICIO DE CLASE
  /* 
  app.get("/session", (req, res) => {
    if (req.session.counter) {
      req.session.counter++;
      res.send(`Se visitó el sitio ${req.session.counter} veces`);
    } else {
      req.session.counter = 1;
      res.send("Bienvenido/a");
    }
  });
  */

//Instanciando socket.io

const serverHTTP = app.listen(port, ()=> console.log("Server running on port: ", port));
const io = new Server(serverHTTP)



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

  socket.on("addMessage", (addMessage) => {
    console.log("Mensaje agregado", addMessage);
    io.emit("addedMessage", addMessage);
})

})

