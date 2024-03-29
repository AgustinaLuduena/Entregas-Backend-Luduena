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
    //Example cart id: 66062c39e26a5ce67ecbb891
    try {
        //quité el parseInt
        let cid =  req.params.cid
        const cart = await DBcartsManager.getCartById(cid);
        console.log(cart)

        if(cart.products.length !== 0){
          //No pude lograr que se muestre correctamente la vista de "cart.handlebars".
            //return res.render('cart', { cart });
            return res.json(cart)
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
    //Example cart id: 66062c39e26a5ce67ecbb891
    //Example product id: 6605d3d38a122c3e421c38df
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

cartsRouter.delete("/:cid/", async (req, res)=>{
  //Delete all products from the chosen cart.
  try {
      let cid =  req.params.cid
      const deleted = await DBcartsManager.deleteAllProducts(cid);

      if (deleted) {
        return res.status(200).json({ message: `Todos los productos del carrito ${cid} han sido eliminados correctamente.` });
    } else {
        return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado.` });
    }
} catch (error) {
    console.error('Error al eliminar todos los productos del carrito:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
}
});




cartsRouter.put("/:cid/", async (req, res) =>{
  //deberá actualizar el carrito con un arreglo de productos con el mismo formato(Object [productId:id + quantity])
  try{
    let cid =  req.params.cid;
    let updateData = req.body;

  /* Modelo para req.body
    [
      {
        "product": "6605d54a8a122c3e421c38f4",
        "quantity": 10
      }
    ]
  */

    const updateSuccessfully = await DBcartsManager.updateCart(cid, updateData)

    if (updateSuccessfully) {
      return res.status(200).send({ status: `Cart with ID ${cid} was successfully updated.` });
    } else {
      return res.status(404).send({ error: `Product with ID ${cid} was not found.` });
  }

  } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
})

cartsRouter.put("/:cid/product/:pid/", async (req, res) =>{
  //Update just the quantity of the chosen product with req.body 
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;

  /* Modelo para req.body
      {
        "quantity": 10
      }
  */

    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'La cantidad debe ser un número válido mayor que cero.' });
    }

    const updated = await DBcartsManager.updateProductQuantity(cid, pid, quantity);

    if (updated) {
        return res.status(200).json({ message: `Cantidad del producto ${pid} en el carrito ${cid} actualizada correctamente.` });
    } else {
        return res.status(404).json({ error: `No se pudo actualizar la cantidad del producto ${pid} en el carrito ${cid}.` });
    }
} catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
}
})

export default cartsRouter


