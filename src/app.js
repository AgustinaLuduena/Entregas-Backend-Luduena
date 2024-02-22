import express from 'express'
import productsRouter from './routes/productsRouter.js'
import cartsRouter from './routes/cartsRouter.js'

const app = express()
const port = 8080

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Routes
app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)

app.listen(port, ()=> console.log("Server running on port: ", port))
