import productsModel from "../models/products.js"

export default class DBProductManager {

    constructor(){
        console.log("Trabajando con ProductManager")
    }

    getProducts = async (page, limit, sort) => {
        let options = {page, limit, lean: true}
        if(sort) {
            options.sort = sort
        }
        let result = await productsModel.paginate({}, options);
        return result;

    }
    
    getProductByID = async (pid) => {
        let result = await productsModel.findById(pid)
        return result
    }

    getProductsByCategory = async (category) => {
        try {
            let result = await productsModel.aggregate([
                {
                    $match: { category: category }
                },
                {
                    $group: { _id: "$category", totalStock: { $sum: "$stock" } }
                }
            ]);
            return result;
        } catch (error) {
            console.error('Error al obtener los productos según ctaegoría:', error);
            throw error;
        }
    };

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
