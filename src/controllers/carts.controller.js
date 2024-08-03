import __dirname from "../dirname.js";
//Factory
import {cartManager} from "../dao/factory.js"
//Models
import productsModel from "../dao/models/products.js";
import Ticket from "../dao/models/ticket.js";
import Purchase from "../dao/models/purchase.js";
//Utils
import { generateRandomCode } from "../utils/utils.js";
//DTO
import CurrentUserDTO from "../dao/dto/dto.js"
//ErrorHandler
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { dataError, notFound, updateError } from "../errorsHandlers/productsError.js";
//Logger
import logger from "../utils/logger-env.js";

//get list of carts
export const getAllCarts = async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.status(200).json({ carts });
      } catch (error) {
        throw CustomError.CustomError(
          "Error", `Error getting data`, 
          errorTypes.ERROR_DATA, 
          dataError())
      }
}

//Add a new cart (Cart Id + products:[])
export const createCart = async (req, res) => {
    try {
      const cart = await cartManager.createCart();
      res.json({cart})
    } catch (error) {
      return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
    }
}

//List of products inside the cart chosen by Id
export const getCartById = async (req, res) => {
    try {
        let cid =  req.params.cid
        const cart = await cartManager.getCartById(cid);

        if(!cart){
          throw CustomError.CustomError(
            "Error", `The Cart Id ${cid} was not found.`,
            errorTypes.ERROR_NOT_FOUND, 
            notFound(cid))
        } else {
          res.json({cart})
        }

      } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
      }
}

//Add the chosen product to chosen the cart (Object [productId:id + quantity])
export const addProduct = async (req, res) => {
    try {
        let cid =  req.params.cid
        let pid =  req.params.pid
        const cart = await cartManager.addProduct(cid, pid);
        res.status(200).json(`Product Id number ${pid} was succesfully add to cart Id number ${cid}.`);

      } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
      }
}

//Delete the chosen product from the chosen cart (Object [productId:id + quantity])
export const deleteProduct = async (req, res) => {
  try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const result = await cartManager.deleteProduct(cid, pid);

      // Verifica el resultado de la operación
      if (result) {
          res.status(200).json({
              success: true,
              message: `Product Id number ${pid} was successfully deleted from cart Id number ${cid}.`
          });
      } else {
          res.status(404).json({
              success: false,
              message: `Product Id number ${pid} not found in cart Id number ${cid}.`
          });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
          success: false,
          message: error.message
      });
  }
};

//Delete all products from the chosen cart.
export const deleteAllProducts = async (req, res) => {
    try {
        let cid =  req.params.cid
        const deleted = await cartManager.deleteAllProducts(cid);
  
        if (deleted) {
          return res.status(200).json({ message: `Todos los productos del carrito ${cid} han sido eliminados correctamente.` });
        } else {
            throw CustomError.CustomError(
              "Error", `The Cart Id ${cid} was not found.`, 
              errorTypes.ERROR_NOT_FOUND, 
              notFound(cid))
        }
    } catch (error) {
        logger.error('Error al eliminar todos los productos del carrito:', error);
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });

    }
}

//Update the cart using an array of products with the format: (Object [productId:id + quantity])
export const updateCart = async (req, res) => {
    try{
        let cid =  req.params.cid;
        let updateData = req.body;
    
        const updateSuccessfully = await cartManager.updateCart(cid, updateData)
    
        if (updateSuccessfully) {
          return res.status(200).json({ status: `Cart with ID ${cid} was successfully updated.` });
        } else {
          throw CustomError.CustomError(
            "Error updating data", `Error trying to update the chosen product.`, 
            errorTypes.ERROR_DATA, 
            updateError())
        }
    
      } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
      }
}

//Update just the quantity of the chosen product with req.body 
export const updateProductQuantity = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
    
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número válido mayor que cero.' });
        }
    
        const updated = await cartManager.updateProductQuantity(cid, pid, quantity);
    
        if (updated) {
            return res.status(200).json({ message: `Cantidad del producto ID: ${pid} en el carrito ID: ${cid}, actualizada correctamente.` });
        } else {
            throw CustomError.CustomError(
              "Error updating data", `No se pudo actualizar la cantidad del producto ${pid} en el carrito ${cid}.`, 
              errorTypes.ERROR_DATA, 
              updateError())
        }
    } catch (error) {
        logger.error('Error al actualizar la cantidad del producto en el carrito:', error);
        return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito.' });
    }
}

export const purchase = async (req, res) => {
  try {
      let cid =  req.params.cid;
      const cart = await cartManager.getCartById(cid);

      if(!cart){
        throw CustomError.CustomError(
          "Error", `The Cart Id ${cid} was not found.`, 
          errorTypes.ERROR_NOT_FOUND, 
          notFound(cid))
      } 

      let totalPurchaseAmount = 0;
      const productsToPurchase = [];
      const productsToKeepInCart = [];

      for (const item of cart.products){
        const product = await productsModel.findById(item.product);
        if (!product) {
            throw CustomError.CustomError(
            "Error", `The product Id ${item.product} was not found.`, 
            errorTypes.ERROR_NOT_FOUND, 
            notFound(item.product))
        }
        if (product.stock >= item.quantity) {
            // Enough stock, reduce stock and add to purchase
            product.stock -= item.quantity;
            await product.save();

            totalPurchaseAmount += product.price*item.quantity;
            productsToPurchase.push(item);
        } else {
            // Insufficient stock, keep in cart
            productsToKeepInCart.push(item);
        }
      }

      if (productsToPurchase.length === 0) {
          return res.send("No hay stock sufiente de los productos seleccionados.")
      }

      const user = req.user.user;
      let userDTO = new CurrentUserDTO(user);
      let userId = user._id;

      //Generate purchase
      const purchase = new Purchase({
          user: userId,
          products: productsToPurchase.map(item => ({
              product: item.product,
              productQuantity: item.quantity,
          })),
      })

      // Create purchase ticket with purchasable products
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

      // Clear cart and keep products that couldn't be purchased
      await cartManager.clearCart(cid);
      await cartManager.updatePurchasedCart(cid, productsToKeepInCart, totalPurchaseAmount);

      logger.info("Compra generada con éxito!")
      return res.json({ticket});


  } catch (error) {
    return res.status(500).json({ status: 'Internal Server Error', massage: error.message });

  }
}
