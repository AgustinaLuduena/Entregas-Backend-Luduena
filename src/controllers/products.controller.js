//Factory
import { productManager } from '../dao/factory.js';
//ErrorHandler
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import {notFound, validateProduct, dataError} from "../errorsHandlers/productsError.js"
import { validateProductFields } from '../middlewares/validateFields.js';
//Logger
import logger from "../utils/logger-env.js";

export const getProducts = async (req, res) => {
    // List of products, page, limit, query, and sort
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let category = req.query.category;
    let sort = req.query.sort;

    try {
        if (isNaN(page) || page < 1) { page = 1 };
        if (isNaN(limit) || limit < 1) { limit = 10 };

        let result;
        if (category) {
            result = await productManager.getProductsByCategory(category);

            if (result.length === 0) {
                return res.status(400).json({ message: `Para la categoría: ${category}, no hay stock disponible.` });
            } else {
                return res.json(result);
            }
        } else {
            if (sort === 'asc' || sort === 'desc') {
                result = await productManager.getProducts(page, limit, { price: sort === 'asc' ? 1 : -1 });
            } else {
                result = await productManager.getProducts(page, limit);
            }

            // Info of pages for the response
            result.isValid = page >= 1 && page <= result.totalPages;
            result.nextLink = result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}` : "";
            result.prevLink = result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}` : "";

            res.json(result);

            //Console response
            const status = result.isValid ? "success" : "error";
            const totalPages = result.totalPages;
            const hasNextPage = result.hasNextPage;
            const hasPrevPage = result.hasPrevPage;
            const prevPage = result.hasPrevPage ? result.prevPage : null;
            const nextPage = result.hasNextPage ? result.nextPage : null;
            const prevLink = result.hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null;
            const nextLink = result.hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null;
    
            const responseObject = {
                status, 
                payload: result.docs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            };
            logger.info(responseObject);
        }  

    } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });

    }
}

//get products with categories details
export const getAllProductsWithCategories = async (req, res) => {
    try {
        const products = await productManager.getAllProductsWithCategories();
        res.status(200).json({ products });
      } catch (err) {
        throw CustomError.CustomError(
            "Error", `Error getting the products data`, 
            errorTypes.ERROR_DATA, 
            dataError())
      }
}

//Get product by ID
export const getProductByID = async (req, res) => {
    try {
        let pid =  req.params.pid
        const product = await productManager.getProductByID(pid);

        if(!product){
            throw CustomError.CustomError(
                "Error", `The product Id ${pid} was not found.`, 
                errorTypes.ERROR_NOT_FOUND, 
                notFound(pid))
        } else {
            return res.json(product);
        }

      } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });

      }
}

//Add a new product  
export const addProduct = async (req, res) => {
    try {
        const {title, code, price, stock, category} = req.body

        // Validate required fields
        validateProductFields(["title", "code", "price", "stock", "category"], req.body);

        //Check for existing title
        let checkTitle = await productManager.getProductByTitle(title)
        if(checkTitle){
            throw CustomError.CustomError(
                `The product title ${title} already exists.` , "Enter a new title.", 
                errorTypes.ERROR_INVALID_ARGUMENTS, 
                validateProduct(req.body))
        }

        //Check for existing code
        let checkCode = await productManager.getProductByCode(code)
        if(checkCode){
            throw CustomError.CustomError(
                `The product code ${code} already exists.` , "Enter a new code.", 
                errorTypes.ERROR_INVALID_ARGUMENTS, 
                validateProduct(req.body))
        }

        let newProduct = {title, code, price, stock, category}
        let addedSuccessfully = await productManager.addProduct(newProduct);
        
        if (addedSuccessfully) {
            return res.status(200).json({ status: `Product with title: ${newProduct.title}, was successfully created.` });
        } else {
            return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
        }
    } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });

    }
}

    /* Modelo de datos para testear por Postman el "req.body" 

        {
        "title" : "Remera deportiva",
        "description" : "Necesita una description",
        "code": 120,
        "price": 4500,
        "status": "true",
        "stock": 10,
        "category": "66314a18b4275625c52199ee",
        "colors": ["negro", "azul"],
        "sizes": ["M", "L"],
        }

    */


//Update a product     
export const updateProduct = async (req, res) => {
    try {
        let pid = req.params.pid;
        let productData = req.body;

        const updateSuccessfully = await productManager.updateProduct(pid, productData)

        if (updateSuccessfully) {
            return res.status(200).json({ status: `Product with ID ${pid} was successfully updated.` });
        } else {
            throw CustomError.CustomError(
                "Error", `The product Id ${pid} was not found.`, 
                errorTypes.ERROR_NOT_FOUND, 
                notFound(pid))
        }
    } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });

    }
}


//Delete product by ID
export const deleteProduct = async (req, res) => {
    try {
        let pid =  req.params.pid
        const selectedProduct = await productManager.deleteProduct(pid);
        if(!selectedProduct){
            throw CustomError.CustomError(
                "Error", `The product Id ${pid} was not found. Cannot delete product.`, 
                errorTypes.ERROR_NOT_FOUND, 
                notFound(pid))
        } else {
            return res.status(200).json({status: `Product with ID ${pid} deleted successfully.`});
        }
      } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });

      }

}