import { Router } from 'express'
import fs, { writeFileSync } from "fs";
import { randomUUID }  from "node:crypto";
import __dirname from "../utils.js";

const cartsRouter = Router()
const pathCart = `${__dirname}/data/cart.json`
//console.log(pathCart)

//Test

cartsRouter.get("/", (req, res) => {
    res.json({carts})
    res.send("Test de cartsRouter")
})


let carts = []

cartsRouter.post("/", (req, res)=>{

    
    //deberá crear un nuevo carrito (id + products:[])
    let jsonCart = fs.readFileSync(pathCart, "utf-8")
    let parsedCart = JSON.parse(jsonCart)

    //Se podría hacer un chequeo de que no se repita el ID

    const ID = randomUUID()

    let cart = {

        id: ID,
        products: []
    
    }

    parsedCart.push(cart)
    let data = JSON.stringify(parsedCart)
    writeFileSync(pathCart, data, null)

    res.send("Cart succesfully created. Your cart information is: " + JSON.stringify(cart))


})  

/* 

cartsRouter.get("/:cid/", (req, res)=>{

    // deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados
})  

cartsRouter.post("/:cid/product/:pid/", (req, res)=>{

    //deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto (product:id + quantity)
})  
*/

export default cartsRouter