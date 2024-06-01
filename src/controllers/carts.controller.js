import __dirname from "../utils.js";
//Factory
import {cartManager} from "../dao/factory.js"
//Models
import productsModel from "../dao/models/products.js";
import Ticket from "../dao/models/ticket.js";
import Purchase from "../dao/models/purchase.js";
//Utils
import { generateRandomCode } from "../utils.js";
//DTO
import CurrentUserDTO from "../dao/dto/dto.js"

//get list of carts
export const getAllCarts = async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.status(200).json({ carts });
      } catch (error) {
        res.status(500).json({ error: `Error al recibir los carritos` });
      }
}

//Add a new cart (Cart Id + products:[])
export const createCart = async (req, res) => {
    try {
        const cart = await cartManager.createCart();
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
        const cart = await cartManager.getCartById(cid);

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
        const cart = await cartManager.addProduct(cid, pid);
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
        const cart = await cartManager.deleteProduct(cid, pid);
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
        const deleted = await cartManager.deleteAllProducts(cid);
  
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
    
        const updateSuccessfully = await cartManager.updateCart(cid, updateData)
    
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
    
        const updated = await cartManager.updateProductQuantity(cid, pid, quantity);
    
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

//Add a new cart (Cart Id + products:[])
export const purchase = async (req, res) => {
  try {
      //res.send("Finalizar compra")
      let cid =  req.params.cid;
      const cart = await cartManager.getCartById(cid);

      if(!cart){return res.json(`Cart Id number ${cid} does not been found.`)} 

      // return res.json({cart})

      let totalPurchaseAmount = 0;
      const productsToPurchase = [];
      const productsToKeepInCart = [];

      for (const item of cart.products){
        const product = await productsModel.findById(item.product);
        if (!product) {
          throw new Error(`Producto con ID ${item.product} no encontrado`);
        }
        if (product.stock >= item.quantity) {
            // Suficiente stock, reducir stock y agregar a la compra
            product.stock -= item.quantity;
            await product.save();

            totalPurchaseAmount += product.price*item.quantity;
            productsToPurchase.push(item);
        } else {
            // No suficiente stock, mantener en el carrito
            productsToKeepInCart.push(item);
        }
      }

      if (productsToPurchase.length === 0) {
          return res.send("No hay stock sufiente de los productos seleccionados.")
      }

      const user = req.user.user;
      let userDTO = new CurrentUserDTO(user);
      let userId = user._id;

      //Generar la compra
      const purchase = new Purchase({
          user: userId || "Error",
          products: productsToPurchase.map(item => ({
              product: item.product,
              productQuantity: item.quantity,
          })),
      })

      //Crear el ticket de compra con los productos que se pueden comprar
      const ticket = new Ticket({
          code: generateRandomCode(10),
          purchaseDatetime: new Date(),
          amount: totalPurchaseAmount,
          purchaser: userId,
          purchaserDetails: userDTO.currentUser,
          products: productsToPurchase.map(item => ({
              id: item.product,
              product: item.product.title,
              productQuantity: item.quantity,
              productTotal: item.product.price*item.quantity,
          })),
      });

      await ticket.save();

      await purchase.save();

      // Limpiar el carrito y mantener los productos que no se pudieron comprar
      await cartManager.clearCart(cid);
      await cartManager.updatePurchasedCart(cid, productsToKeepInCart, totalPurchaseAmount);

      return res.json({ticket});
      console.log("Compra generada con éxito!")

      

  } catch (err) {
      console.error('Error:', err);
      res.status(500).json('Internal Server Error');
  }
}
