// import cartModel from "../models/carts.js";
// import productsModel from "../models/products.js";
// //ErrorHandler
// import { CustomError } from '../../errorsHandlers/customError.js';
// import { errorTypes } from '../../errorsHandlers/errorTypes.js';
// import { notFound, updateError } from "../../errorsHandlers/productsError.js"
// //Logger
// import logger from "../../utils/logger-env.js";


// export default class CartManager {

//     constructor(){
//         logger.info("Trabajando con CartManager");
//     }

//     getAllCarts = async () => {
//         let result = await cartModel
//         .find()
//         .populate({
//             path: 'products',
//             populate: {
//                 path: 'product', 
//                 model: 'Products' 
//             }
//         })
//         .lean();
//         return result
//     }

//     getCartById = async (cid) => {
//         let result = await cartModel.findById(cid)
//             .populate({
//                 path: 'products',
//                 populate: {
//                     path: 'product', 
//                     model: 'Products' 
//                 }
//             })
//             .lean();
//         logger.info(result)
//         return result
//     }

//     createCart = async () => {
//         let result = await cartModel.create({})
//         return result
//     }

//     addProduct = async (cid, pid) => {
//         let cart = await cartModel.findById(cid)
//         let product = cart.products.find((product) => product.product.toString() === pid)

//         if (product) {
//             product.quantity += 1;
//         } else {
//             cart.products.push({ product: pid,  quantity: 1});
//         }
//         return await cart.save();
//     }

//     deleteProduct = async (cid, pid) => {
//         let cart = await cartModel.findById(cid)
//         let product = cart.products.findIndex((product) => product.product.toString() === pid)

//         if(product === -1){
//                 throw CustomError.CustomError(
//                 "Error", `The product Id ${pid} was not found.`, 
//                 errorTypes.ERROR_NOT_FOUND, 
//                 notFound(pid))
//         }else{
//             cart.products.splice(product,1)
//         }
//         return await cart.save();
//     }


//     updateCart = async (cid, updateData) => {
//         try {
//             const productIds = updateData.map(item => item.product);
//             const existingProducts = await productsModel.find({ _id: { $in: productIds } }, '_id');
    
//             if (existingProducts.length !== updateData.length) {
//                 return false;
//             }
    
//             let cart = await cartModel.findById(cid);
    
//             updateData.forEach((item) => {
//                 let existingProductIndex = cart.products.findIndex((product) => product.product.toString() === item.product);
//                 if (existingProductIndex !== -1) {
//                     cart.products[existingProductIndex].quantity = item.quantity;
//                 } else {
//                     cart.products.push({ product: item.product, quantity: item.quantity });
//                 }
//             });
    
//             await cart.save();
//             return true;
//         } catch (error) {
//             logger.error('Error al actualizar el carrito:', error);
//             return false;
//         }
//     }
    
//     updateProductQuantity = async (cid, pid, newQuantity) => {
//         try {
//             let cart = await cartModel.findById(cid);
    
//             if (!cart) {
//                 return false;
//             }
    
//             let productIndex = cart.products.findIndex(product => product.product.toString() === pid);
    
//             if (productIndex === -1) {
//                 return false; 
//             }
    
//             cart.products[productIndex].quantity = newQuantity;
    
//             await cart.save();
//             return true; 

//         } catch (error) {
//             logger.error('Error al actualizar la cantidad del producto en el carrito:', error);
//             return false;
//         }
    
//     }

//     deleteAllProducts = async (cid) => {
//         try {
//             const cart = await cartModel.findById(cid);

//             if (!cart) {
//                 return false;
//             }

//             cart.products = [];

//             await cart.save();
    
//             return true; 
//         } catch (error) {
//             logger.error('Error al eliminar todos los productos del carrito:', error);
//             return false; 
//         }
//     }
    
//     updatePurchasedCart = async (cid, products, total) => {
//         try {
//             const cart = await cartModel.findByIdAndUpdate(
//                 cid,
//                 { products: products, total: total },
//                 { new: true }
//             );
//             return cart;
//         } catch (error) {
//             throw CustomError.CustomError(
//                 "Error updating data", `Error trying to update the chosen cart.`, 
//                 errorTypes.ERROR_DATA, 
//                 updateError())
//         }
//     }

//     clearCart = async (cid) => {
//         try {
//             const cart = await cartModel.findByIdAndUpdate(
//                 cid,
//                 { products: [], total: 0 },
//                 { new: true }
//             );
//             return cart;
//         } catch (error) {
//             throw CustomError.CustomError(
//                 "Error updating data", `Error trying to empty the chosen cart.`, 
//                 errorTypes.ERROR_DATA, 
//                 updateError())
//         }
//     }

// }

// dao/managers/cartManager.js

import CartRepository from "../../repositories/cartRepository.js";
import { CustomError } from '../../errorsHandlers/customError.js';
import { errorTypes } from '../../errorsHandlers/errorTypes.js';
import { notFound, updateError } from "../../errorsHandlers/productsError.js";
import logger from "../../utils/logger-env.js";

const cartRepository = new CartRepository();

export default class CartManager {
    constructor() {
        logger.info("Trabajando con CartManager");
    }

    async getAllCarts() {
        try {
            return await cartRepository.getAll();
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error getting data`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }

    async getCartById(cid) {
        const cart = await cartRepository.getById(cid);
        if (!cart) {
            throw CustomError.CustomError(
                "Error", `The Cart Id ${cid} was not found.`,
                errorTypes.ERROR_NOT_FOUND,
                notFound(cid)
            );
        }
        return cart;
    }

    async createCart() {
        return await cartRepository.create();
    }

    async addProduct(cid, pid) {
        const cart = await cartRepository.getById(cid);
        if (!cart) {
            throw CustomError.CustomError(
                "Error", `The Cart Id ${cid} was not found.`,
                errorTypes.ERROR_NOT_FOUND,
                notFound(cid)
            );
        }
        console.log(pid);
        console.log(cart.products);
        const product = cart.products.find((product) => product.product._id.toString() === pid);
        console.log(product);
       
        if (product) {
            console.log(product.quantity);
            product.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        
        await cart.save();
        return cart;
    }

    
    async deleteProduct(cid, pid) {
        const deleted = await cartRepository.deleteProduct(cid, pid);
        if (!deleted) {
            throw CustomError.CustomError(
                "Error", `The product Id ${pid} was not found.`,
                errorTypes.ERROR_NOT_FOUND,
                notFound(pid)
            );
        }
        return deleted;
    }

    async updateCart(cid, updateData) {
        const updated = await cartRepository.update(cid, updateData);
        if (!updated) {
            throw CustomError.CustomError(
                "Error updating data", `Error trying to update the chosen product.`,
                errorTypes.ERROR_DATA,
                updateError()
            );
        }
        return updated;
    }

    async updateProductQuantity(cid, pid, newQuantity) {
        const updated = await cartRepository.updateProductQuantity(cid, pid, newQuantity);
        if (!updated) {
            throw CustomError.CustomError(
                "Error updating data", `No se pudo actualizar la cantidad del producto ${pid} en el carrito ${cid}.`,
                errorTypes.ERROR_DATA,
                updateError()
            );
        }
        return updated;
    }

    async deleteAllProducts(cid) {
        const deleted = await cartRepository.deleteAllProducts(cid);
        if (!deleted) {
            throw CustomError.CustomError(
                "Error", `The Cart Id ${cid} was not found.`,
                errorTypes.ERROR_NOT_FOUND,
                notFound(cid)
            );
        }
        return deleted;
    }

    async updatePurchasedCart(cid, products, total) {
        return await cartRepository.updatePurchasedCart(cid, products, total);
    }

    async clearCart(cid) {
        return await cartRepository.clearCart(cid);
    }
}

