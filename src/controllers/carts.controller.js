import __dirname from "../utils.js";
import CartManager from '../dao/classes/DBCartManager.js';

const DBcartsManager = new CartManager();

//get list of carts
export const getAllCarts = async (req, res) => {
    try {
        const carts = await DBcartsManager.getAllCarts();
        res.status(200).json({ carts });
      } catch (error) {
        res.status(500).json({ error: `Error al recibir los carritos` });
      }
}

//Add a new cart (Cart Id + products:[])
export const createCart = async (req, res) => {
    try {
        const cart = await DBcartsManager.createCart();
        res.json({cart})
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal Server Error');
    }
}

//List of products inside the cart chosen by Id
export const getCartById = async (req, res) => {
    try {
        let cid =  req.params.cid
        const cart = await DBcartsManager.getCartById(cid);

        if(!cart){
          return res.json(`Cart Id number ${cid} does not been found.`)
        } else {
          res.json({cart})
        }

      } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal Server Error');
      }
}

//Add the chosen product to chosen the cart (Object [productId:id + quantity])
export const addProduct = async (req, res) => {
    try {
        let cid =  req.params.cid
        let pid =  req.params.pid
        const cart = await DBcartsManager.addProduct(cid, pid);
        res.status(200).json(`Product Id number ${pid} was succesfully add to cart Id number ${cid}.`);
        //Try SweetAlert

      } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal Server Error');
      }
}

//Delete the chosen product from the chosen cart (Object [productId:id + quantity])
export const deleteProduct = async (req, res) => {
    try {
        let cid =  req.params.cid
        let pid =  req.params.pid
        const cart = await DBcartsManager.deleteProduct(cid, pid);
        res.status(200).json(`Product Id number ${pid} was succesfully deleted from cart Id number ${cid}.`);

      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
}

//Delete all products from the chosen cart.
export const deleteAllProducts = async (req, res) => {
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
}

//deberá actualizar el carrito con un arreglo de productos con el mismo formato(Object [productId:id + quantity])
export const updateCart = async (req, res) => {
    try{
        let cid =  req.params.cid;
        let updateData = req.body;
    
      /* Modelo para req.body
    
        [
          {
            "product": "", //cargar el id de un producto
            "quantity": 10 //cargar catidad deseada
          }
        ]
    
      */
    
        const updateSuccessfully = await DBcartsManager.updateCart(cid, updateData)
    
        if (updateSuccessfully) {
          return res.status(200).json({ status: `Cart with ID ${cid} was successfully updated.` });
        } else {
          return res.status(404).json({ error: `Error trying to update the chosen product.` });
        }
    
      } catch (err) {
          console.error('Error:', err);
          res.status(500).json('Internal Server Error');
      }
}

//Update just the quantity of the chosen product with req.body 
export const updateProductQuantity = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
    
      /* Modelo para req.body
          {
            "quantity": 10 //cargar catidad deseada
          }
      */
    
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número válido mayor que cero.' });
        }
    
        const updated = await DBcartsManager.updateProductQuantity(cid, pid, quantity);
    
        if (updated) {
            return res.status(200).json({ message: `Cantidad del producto ID: ${pid} en el carrito ID: ${cid}, actualizada correctamente.` });
        } else {
            return res.status(404).json({ error: `No se pudo actualizar la cantidad del producto ${pid} en el carrito ${cid}.` });
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}