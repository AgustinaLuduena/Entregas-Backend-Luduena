import productsModel from "../models/products.js"

export default class DBProductManager {

    constructor(){
        console.log("Trabajando con ProductManager")
    }

    getProducts = async (limit) => {
        let result = await productsModel.find().limit(limit)
        return result
    }
    getProductByID = async (pid) => {
        let result = await productsModel.findById(pid)
        return result
    }
    addProduct = async (product) => {
        let result = await productsModel.create(product)
        return result
    }
    updateProduct = async (pid, productData) => {
        let result = await productsModel.updateOne({_id:pid}, {$set: productData})
        return result
    }
    deleteProduct = async (pid) => {
        let result = await productsModel.deleteOne({_id:pid})
        return result
    }

}