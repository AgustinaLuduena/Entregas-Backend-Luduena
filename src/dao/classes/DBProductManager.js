import productsModel from "../models/products.js"
//ErrorHandler
import { CustomError } from '../../errorsHandlers/customError.js';
import { errorTypes } from '../../errorsHandlers/errorTypes.js';
import { notFound } from "../../errorsHandlers/productsError.js"

export default class DBProductManager {

    constructor(){
        console.log("ProductManager Constructor")
    }

    getProducts = async (page, limit, sort) => {
        let options = {page, limit, lean: true}
        if(sort) {
            options.sort = sort
        }
        let result = await productsModel.paginate({}, options)

        await productsModel.populate(result.docs, { path: "category" });
        
        result.docs = result.docs.map(product => {
            return {
                ...product,
                category: product.category ? product.category.name : null
            };
        });

        return result;

    }

    getProductByID = async (pid) => {
        let result = await productsModel.findById(pid)
        return result
    }

    getProductByTitle = async (title) => {
        let result = await productsModel.findOne({title : title})
        return result
    }

    getProductByCode = async (code) => {
        let result = await productsModel.findOne({code : code})
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
        let result = await productsModel.findById(pid)
        if(!result) {
            throw CustomError.CustomError(
                "Error", `The product Id ${pid} was not found.`, 
                errorTypes.ERROR_NOT_FOUND, 
                notFound(pid))
        } else {
            let deleteProduct = await productsModel.deleteOne({_id:pid})
            return deleteProduct        
        }

    }

    //Products with category details 
    getAllProductsWithCategories = async () => {
        try {
        const products = await productsModel.find().populate("category");
        return products;
        } catch (error) {
        console.log("Error  al obtener todos lo productos");
        }
    };

}
