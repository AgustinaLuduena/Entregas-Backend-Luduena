import { Router } from 'express'
import fs, { writeFileSync } from "fs";
import __dirname from "../utils.js";

const cartsRouter = Router()
const pathCart = `${__dirname}/data/cart.json`
const pathProducts = `${__dirname}/data/products.json`


cartsRouter.post("/", (req, res)=>{
    
    //Add a new cart (Cart Id + products:[])
    let readCart = fs.readFileSync(pathCart, "utf-8")
    let parsedCart = JSON.parse(readCart)

    let generateId = () => {
        let id = 0;
    
        if (parsedCart.length === 0) {
            id = 1;
        } else {
            id = parsedCart[parsedCart.length - 1].id + 1;
        }
        return id;
    }

    let cart = {
        id: generateId(),
        products: []
    }

    parsedCart.push(cart)
    let data = JSON.stringify(parsedCart)
    writeFileSync(pathCart, data, null)

    res.send("Cart succesfully created. Your cart information is: " + JSON.stringify(cart))

})  


cartsRouter.get("/:cid/", (req, res) => {

    //List of products inside the cart chosen by Id
    let cid =  parseInt(req.params.cid)
    let readCart = fs.readFileSync(pathCart, "utf-8")
    let parsedCart = JSON.parse(readCart)

    let filteredCart = parsedCart.find((cart) => cart.id === cid)

    if(!filteredCart) {
        return res.status(404).send(`Error. Cart Id number ${cid} not found.`);
    } 
    
    if (Array.isArray(filteredCart.products) && filteredCart.products.length === 0) {
        return res.status(200).send(`Cart Id number ${cid} does not have any products yet.`);
    }
        
    res.json(filteredCart.products)
    
})  


cartsRouter.post("/:cid/product/:pid/", (req, res)=>{

    //Add the chosen product to chosen the cart (Object [productId:id + quantity])
    //Get the product chosen by Id
    let pid =  parseInt(req.params.pid)
    let readProducts = fs.readFileSync(pathProducts, "utf-8")
    let parsedProducts = JSON.parse(readProducts)

    let filteredProduct = parsedProducts.find((product) => product.id === pid)

    //Get the cart chosen by Id
    let cid =  parseInt(req.params.cid)
    let readCart = fs.readFileSync(pathCart, "utf-8")
    let parsedCart = JSON.parse(readCart)

    let filteredCart = parsedCart.findIndex((cart) => cart.id === cid)

    if (filteredCart === -1) {
        return res.send(`Error. Cart Id number ${cid} not found.`);
      }

    if (!filteredProduct) {
        return res.send(`Error. Product Id number ${pid} not found.`);
      } else {
        let checkExistingProduct = parsedCart[filteredCart].products.findIndex((p) => p.productId === filteredProduct.id);
    
        if (checkExistingProduct !== -1) {
          parsedCart[filteredCart].products[checkExistingProduct].quantity += 1;
        } else {
            let cartProduct = {
                productId: filteredProduct.id,
                quantity: 1,
            };
    
          parsedCart[filteredCart].products.push(cartProduct);
        }
    
        let productAddToCart = JSON.stringify(parsedCart);
        writeFileSync(pathCart, productAddToCart, null);
        res.status(200).send(`Product Id number ${filteredProduct.id} was succesfully add to cart Id number ${cid}.`);
      }
})  

export default cartsRouter

