import productRepository from '../../repositories/productRepository.js';
//ErrorHandler
import { CustomError } from '../../errorsHandlers/customError.js';
import { errorTypes } from '../../errorsHandlers/errorTypes.js';
import { notFound } from "../../errorsHandlers/productsError.js"
//Logger
import logger from "../../utils/logger-env.js";

export default class DBProductManager {

    constructor(){
        logger.info("ProductManager Constructor");
    }

    getProducts = async (page, limit, sort) => {
        let options = { page, limit, lean: true };
        if (sort) {
            options.sort = sort;
        }
        let result = await productRepository.paginate({}, options);
        await productRepository.populate(result.docs, { path: "category" });
        result.docs = result.docs.map(product => ({
            ...product,
            category: product.category ? product.category.name : null
        }));
        return result;
    }

    getProductByID = async (pid) => {
        return await productRepository.findById(pid);
    }

    getProductByTitle = async (title) => {
        return await productRepository.findOne({ title });
    }

    getProductByCode = async (code) => {
        return await productRepository.findOne({ code });
    }

    getProductsByCategory = async (category) => {
        try {
            let normalizedCategory = category.toLowerCase().trim().replace(/\s+/g, ' ');
            let pipeline = [
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: {
                        path: "$category",
                        includeArrayIndex: 'categoryIndex',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        "category.name": normalizedCategory
                    }
                },
                {
                    $group: {
                        _id: "$category.name",
                        totalStock: { $sum: "$stock" }
                    }
                }
            ];
            return await productRepository.aggregate(pipeline);
        } catch (error) {
            logger.error('Error al obtener los productos según categoría:', error);
            throw error;
        }
    }

    addProduct = async (product) => {
        return await productRepository.create(product);
    }

    updateProduct = async (pid, productData) => {
        return await productRepository.updateOne({ _id: pid }, { $set: productData });
    }

    deleteProduct = async (pid) => {
        let result = await productRepository.findById(pid);
        if (!result) {
            throw CustomError.CustomError(
                "Error", `The product Id ${pid} was not found.`, 
                errorTypes.ERROR_NOT_FOUND, 
                notFound(pid)
            );
        } else {
            return await productRepository.deleteOne({ _id: pid });
        }
    }

    getAllProductsWithCategories = async () => {
        try {
            return await productRepository.find();
        } catch (error) {
            logger.error("Error al obtener todos los productos", error);
        }
    }
}
