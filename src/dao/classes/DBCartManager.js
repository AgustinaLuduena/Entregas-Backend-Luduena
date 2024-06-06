import cartModel from "../models/carts.js";
import productsModel from "../models/products.js";
//ErrorHandler
import { CustomError } from '../../errorsHandlers/customError.js';
import { errorTypes } from '../../errorsHandlers/errorTypes.js';
import { notFound, updateError } from "../../errorsHandlers/productsError.js"


export default class CartManager {

    constructor(){
        console.log("Trabajando con CartManager")
    }

    getAllCarts = async () => {
        let result = await cartModel
        .find()
        .populate({
            path: 'products',
            populate: {
                path: 'product', 
                model: 'Products' 
            }
        })
        .lean();
        return result
    }

    getCartById = async (cid) => {
        let result = await cartModel.findById(cid)
            .populate({
                path: 'products',
                populate: {
                    path: 'product', 
                    model: 'Products' 
                }
            })
            .lean();
        console.log(result)
        return result
    }

    createCart = async () => {
        let result = await cartModel.create({})
        return result
    }

    addProduct = async (cid, pid) => {
        let cart = await cartModel.findById(cid)
        let product = cart.products.find((product) => product.product.toString() === pid)

        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ product: pid,  quantity: 1});
        }
        return await cart.save();
    }

    deleteProduct = async (cid, pid) => {
        let cart = await cartModel.findById(cid)
        let product = cart.products.findIndex((product) => product.product.toString() === pid)

        if(product === -1){
                throw CustomError.CustomError(
                "Error", `The product Id ${pid} was not found.`, 
                errorTypes.ERROR_NOT_FOUND, 
                notFound(pid))
        }else{
            cart.products.splice(product,1)
        }
        return await cart.save();
    }


    updateCart = async (cid, updateData) => {
        try {
            const productIds = updateData.map(item => item.product);
            const existingProducts = await productsModel.find({ _id: { $in: productIds } }, '_id');
    
            if (existingProducts.length !== updateData.length) {
                return false;
            }
    
            let cart = await cartModel.findById(cid);
    
            updateData.forEach((item) => {
                let existingProductIndex = cart.products.findIndex((product) => product.product.toString() === item.product);
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity = item.quantity;
                } else {
                    cart.products.push({ product: item.product, quantity: item.quantity });
                }
            });
    
            await cart.save();
            return true;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            return false;
        }
    }
    
    updateProductQuantity = async (cid, pid, newQuantity) => {
        try {
            let cart = await cartModel.findById(cid);
    
            if (!cart) {
                return false;
            }
    
            let productIndex = cart.products.findIndex(product => product.product.toString() === pid);
    
            if (productIndex === -1) {
                return false; 
            }
    
            cart.products[productIndex].quantity = newQuantity;
    
            await cart.save();
            return true; 

        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            return false;
        }
    
    }

    deleteAllProducts = async (cid) => {
        try {
            const cart = await cartModel.findById(cid);

            if (!cart) {
                return false;
            }

            cart.products = [];

            await cart.save();
    
            return true; 
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error);
            return false; 
        }
    }
    
    updatePurchasedCart = async (cid, products, total) => {
        try {
            const cart = await cartModel.findByIdAndUpdate(
                cid,
                { products: products, total: total },
                { new: true }
            );
            return cart;
        } catch (error) {
            throw CustomError.CustomError(
                "Error updating data", `Error trying to update the chosen cart.`, 
                errorTypes.ERROR_DATA, 
                updateError())
        }
    }

    clearCart = async (cid) => {
        try {
            const cart = await cartModel.findByIdAndUpdate(
                cid,
                { products: [], total: 0 },
                { new: true }
            );
            return cart;
        } catch (error) {
            throw CustomError.CustomError(
                "Error updating data", `Error trying to empty the chosen cart.`, 
                errorTypes.ERROR_DATA, 
                updateError())
        }
    }

}
