//Factory
import { productManager } from '../dao/factory.js';
import { userManager } from '../dao/factory.js';
//ErrorHandler
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { notFound, validateProduct, dataError } from "../errorsHandlers/productsError.js";
import { validateProductFields } from '../middlewares/validateFields.js';
//Logger
import logger from "../utils/logger-env.js";

export const getProducts = async (req, res) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let category = req.query.category;
    let sort = req.query.sort;

    try {
        if (isNaN(page) || page < 1) { page = 1; }
        if (isNaN(limit) || limit < 1) { limit = 10; }

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

            result.isValid = page >= 1 && page <= result.totalPages;
            result.nextLink = result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}` : "";
            result.prevLink = result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}` : "";

            res.json(result);
        }  
    } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', message: error.message });
    }
}

export const getAllProductsWithCategories = async (req, res) => {
    try {
        const products = await productManager.getAllProductsWithCategories();
        res.status(200).json({ products });
    } catch (err) {
        throw CustomError.CustomError(
            "Error", `Error getting the products data`, 
            errorTypes.ERROR_DATA, 
            dataError()
        );
    }
}

export const getProductByID = async (req, res) => {
    try {
        let pid = req.params.pid;
        const product = await productManager.getProductByID(pid);
        if (!product) {
            throw CustomError.CustomError(
                "Error", `The product Id ${pid} was not found.`, 
                errorTypes.ERROR_NOT_FOUND, 
                notFound(pid)
            );
        } else {
            return res.json(product);
        }
    } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', message: error.message });
    }
}

export const addProduct = async (req, res) => {
    try {
        const { title, code, price, stock, category } = req.body;
        const owner = req.user.user._id;

        validateProductFields(["title", "code", "price", "stock", "category"], req.body);

        let checkTitle = await productManager.getProductByTitle(title);
        if (checkTitle) {
            throw CustomError.CustomError(
                `The product title ${title} already exists.`, "Enter a new title.", 
                errorTypes.ERROR_INVALID_ARGUMENTS, 
                validateProduct(req.body)
            );
        }

        let checkCode = await productManager.getProductByCode(code);
        if (checkCode) {
            throw CustomError.CustomError(
                `The product code ${code} already exists.`, "Enter a new code.", 
                errorTypes.ERROR_INVALID_ARGUMENTS, 
                validateProduct(req.body)
            );
        }

        if (!owner) {
            logger.warning(`User no encontrado: ${owner}`);
            let newProduct = { title, code, price, stock, category };
            let addedSuccessfully = await productManager.addProduct(newProduct);
            if (addedSuccessfully) {
                return res.status(200).json({ status: `Product with title: ${newProduct.title}, was successfully created.` });
            } else {
                return res.status(500).json({ status: 'Internal Server Error', message: error.message });
            }
        } else {
            let newProduct = { title, code, price, stock, category, owner };
            let addedSuccessfully = await productManager.addProduct(newProduct);
            if (addedSuccessfully) {
                return res.status(200).json({ status: `Product with title: ${newProduct.title}, was successfully created.` });
            } else {
                return res.status(500).json({ status: 'Internal Server Error', message: error.message });
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        let pid = req.params.pid;
        let productData = req.body;
        let userId = req.user.user._id;

        const product = await productManager.getProductByID(pid);
        const user = await userManager.getById(userId);

        if (req.user.user.role === 'admin' || (user.role === 'Premium' && user && user._id.toString() == product.owner.toString()) || req.user.user.role === 'admin' && !product.owner) {
            await productManager.updateProduct(pid, productData);
            return res.status(200).json({ status: `Product with ID ${pid} was successfully updated.` });
        } else {
            return res.status(403).json({ message: 'Unauthorized user to update products.' });
        }
    } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        let pid = req.params.pid;
        let userId = req.user.user._id;

        const product = await productManager.getProductByID(pid);
        const user = await userManager.getById(userId);

        if (req.user.user.role === 'admin' || (user.role === 'Premium' && user && user._id.toString() == product.owner.toString()) || req.user.user.role === 'admin' && !product.owner) {
            await productManager.deleteProduct(pid);
            return res.status(200).json({ status: `Product with ID ${pid} deleted successfully.` });
        } else {
            return res.status(403).json({ message: 'Unauthorized user to delete products.' });
        }
    } catch (error) {
        return res.status(500).json({ status: 'Internal Server Error', message: error.message });
    }
}
