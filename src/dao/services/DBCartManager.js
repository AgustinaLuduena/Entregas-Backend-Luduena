import cartModel from "../models/carts.js";
import productsModel from "../models/products.js";

export default class CartManager {

    constructor(){
        console.log("Trabajando con CartManager")
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
            console.log("Producto no encontrado")
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
    

}
