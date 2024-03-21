import { Router } from 'express'
//import fs, { writeFileSync } from "fs";
import __dirname from "../utils.js";
import CartManager from '../dao/services/DBCartManager.js';

const cartsRouter = Router()
const DBcartsManager = new CartManager();

//const pathCart = `${__dirname}/data/cart.json`
//const pathProducts = `${__dirname}/data/products.json`


cartsRouter.post("/", async (req, res)=>{
    
    //Add a new cart (Cart Id + products:[])
    try {
        const cart = await DBcartsManager.createCart();
        res.json({cart})
    
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
})  


cartsRouter.get("/:cid/", async (req, res) => {

    //List of products inside the cart chosen by Id
    //Example cart id: 65f608274a88f49f5dfc28df
    try {
        //quité el parseInt
        let cid =  req.params.cid
        const cart = await DBcartsManager.getCartById(cid);

        if(cart.products.length !== 0){
            return res.json(cart.products)
        }else{
            return res.send(`Cart Id number ${cid} does not have any products yet.`)
        }

      } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
      }
    
})  


cartsRouter.post("/:cid/product/:pid/", async (req, res)=>{

    //Add the chosen product to chosen the cart (Object [productId:id + quantity])
    //Example cart id: 65f608274a88f49f5dfc28df
    //Example product id: 65f61baa0fa6cbdc1a5c69ea
    try {
        let cid =  req.params.cid
        let pid =  req.params.pid
        const cart = await DBcartsManager.addProduct(cid, pid);
        res.status(200).send(`Product Id number ${pid} was succesfully add to cart Id number ${cid}.`);

      } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
      }
})  

cartsRouter.delete("/:cid/product/:pid/", async (req, res)=>{

    //Delete the chosen product from the chosen cart (Object [productId:id + quantity])
    try {
        let cid =  req.params.cid
        let pid =  req.params.pid
        const cart = await DBcartsManager.deleteProduct(cid, pid);
        res.status(200).send(`Product Id number ${pid} was succesfully deleted from cart Id number ${cid}.`);

      } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
      }

})  

export default cartsRouter

