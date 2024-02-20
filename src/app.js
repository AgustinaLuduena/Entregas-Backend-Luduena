import express from 'express'
import productsRouter from './routes/productsRouter.js'
import cartsRouter from './routes/cartsRouter.js'
/*
Método para obtener la ruta absoluta.
PODRÍA ESTAR EN UN ARCHIVO APARTE E IMPORTARSE CUANDO FUERA NECESARIO. 
EL PROFESOR TAMBIÉN LO VUELVE A UTILIZAR EN EL ROUTER PARA LA RUTA QUE SE VINCULA CON EL INDEX.HTML

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
*/

const app = express()
const port = 8080


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}))
/*
Este es para la carpeta PUBLIC. No sé si la necesito para el proyecto.
app.use(express.static(`${__dirname}/public`))
*/

//Routes
app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)


// app.get("/", (req, res) => {
//     res.send("Hola")
// })

app.listen(port, ()=> console.log("Server running on port: ", port))
