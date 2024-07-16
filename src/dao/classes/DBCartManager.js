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

