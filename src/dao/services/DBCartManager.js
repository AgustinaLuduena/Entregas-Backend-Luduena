import cartModel from "../models/carts.js"

export default class CartManager {

    constructor(){
        console.log("Trabajando con CartManager")
    }

    getCartById = async (cid) => {
        let result = await cartModel.findById(cid)
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
}