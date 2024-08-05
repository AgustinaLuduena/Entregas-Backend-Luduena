//Factory
import { productManager, cartManager, userManager } from "../dao/factory.js";
//Models
import userModel from "../dao/models/users.js";
import productsModel from "../dao/models/products.js";
import Ticket from "../dao/models/ticket.js";
import Purchase from "../dao/models/purchase.js";
//Utils
import { generateRandomCode } from "../utils/utils.js";
//DTO
import CurrentUserDTO from "../dao/dto/dto.js"
//ErrorHandler
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { notFound } from "../errorsHandlers/productsError.js";
//Logger
import logger from "../utils/logger-env.js";

export const index = async (req, res) => {
    try {
        res.render('index', {title: "Home"});
      } catch (error) {
        logger.error(error);
        res.status(500).send('Error interno del servidor');
      }
}

export const register = async (req, res) => {
    try{
        res.render("register", {title: "Register"});
    } catch (err) {
        logger.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
}

export const login = async (req, res) => {
    try{
        res.render("login", {title: "Login"});
    } catch (err) {
        logger.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
}

export const profile = async (req, res) => {
    try{
        if(req.user) {
            let user = req.user.user
            res.render("profile", { user: user });
        } else {
            res.render("notAvailable", {title: "Page Not Available"});
        }

    } catch (err) {
        logger.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
}

// List of products, page, limit, query, and sort usando HANDLEBARS
export const getProducts = async (req, res) => {

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

            if (!result) {
                return res.status(400).send({ status: `Para la categoría: ${category}, no hay stock disponible.` });
            } else {
                return res.json(result);
            }
        } else {
            if (sort === 'asc' || sort === 'desc') {
                result = await productManager.getProducts(page, limit, { price: sort === 'asc' ? 1 : -1 });
            } else {
                result = await productManager.getProducts(page, limit);
            }

            // View
            result.isValid = page >= 1 && page <= result.totalPages;
            result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort}` : "";
            result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort}` : "";

            const user = req.user.user;

            if(user) {
                logger.info(user);

                res.render('products', {
                    user: user,
                    products: result.docs,
                    hasPrevPage: result.hasPrevPage,
                    prevLink: result.prevLink,
                    page: result.page,
                    hasNextPage: result.hasNextPage,
                    nextLink: result.nextLink
                });
            } else {
                res.render('products', {
                    products: result.docs,
                    hasPrevPage: result.hasPrevPage,
                    prevLink: result.prevLink,
                    page: result.page,
                    hasNextPage: result.hasNextPage,
                    nextLink: result.nextLink
                });
            }

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
        }  

    } catch (err) {
        logger.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
}
export const getCartById = async (req, res) => {
    try {
        if(req.user){
            let user = req.user.user

            let cid = user.cart
            const cartData = await cartManager.getCartById(cid);

            if(!cartData){
                throw CustomError.CustomError(
                  "Error", `Cart id ${cid} was not found.`,
                  errorTypes.ERROR_NOT_FOUND, 
                  notFound(cid))
            }

            let products = cartData.products.map(product => ({
                product: product.product.title,
                productId: product.product._id,
                quantity: product.quantity,
                price: product.price
            }));

            let total = cartData.products.reduce((sum, product) => sum + product.price, 0);

            let cart = {
                cid: cartData._id,
                products: products,
                total: total
            };

            if (req.accepts("html")) {
                console.log(cart)
                return res.render("cart", { cart: cart });
            } else {
                return res.json(cart);
            }
        } else {
            res.render("notAvailable", {title: "Page Not Available"});
        }

      } catch (error) {
        logger.error('Error:', error);
        res.status(500).json('Internal Server Error');
      }
}

export const restore = async (req, res) => {
    try{
        const { token } = req.query;
        res.render("restore", { token });
    }catch (error){
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
    }
}

export const forgottenPass = async (req, res) => {
    try{
        res.render("forgottenPass");
    }catch (error){
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
    }

}

export const upload = async (req, res) => {
    try{
        if(req.user) {
            let user = req.user.user
            res.render("uploadDocs", { user: user });
        } else {
            res.render("notAvailable", {title: "Page Not Available"});
        }
    }catch (error){
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
    }

}

export const getUsersView = async (req, res) => {
    try {
        const users = await userManager.getAllUsers();
        res.render('adminUsers', { users });
    } catch (error) {
        logger.error(`Error fetching users: ${error}`);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const newRole = req.body.role;
        await userModel.findByIdAndUpdate(userId, { role: newRole })
        res.redirect('/admin/users');
    } catch (error) {
        logger.error(`Error updating user: ${error}`);
        res.status(500).json({ error: 'Error updating user' });
    }
};
  
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await userModel.deleteOne({ _id: userId });
        res.redirect('/admin/users');
    } catch (error) {
        logger.error(`Error updating user: ${error}`);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

export const purchase = async (req, res) => {
    try {
        const user = req.user.user;
        let cid = user.cart
        const cart = await cartManager.getCartById(cid);
    
        if (!cart) {
            throw CustomError.CustomError(
            "Error", `The Cart Id ${cid} was not found.`,
            errorTypes.ERROR_NOT_FOUND,
            notFound(cid)
            );
        }
    
        let totalPurchaseAmount = 0;
        const productsToPurchase = [];
        const productsToKeepInCart = [];
    
        for (const item of cart.products) {
            const product = await productsModel.findById(item.product);
            if (!product) {
            throw CustomError.CustomError(
                "Error", `The product Id ${item.product} was not found.`,
                errorTypes.ERROR_NOT_FOUND,
                notFound(item.product)
            );
            }
            if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
    
            totalPurchaseAmount += product.price * item.quantity;
            productsToPurchase.push(item);
            } else {
            productsToKeepInCart.push(item);
            }
        }
    
        if (productsToPurchase.length === 0) {
            return res.send("No hay stock suficiente de los productos seleccionados.");
        }
    
        let userDTO = new CurrentUserDTO(user);
        let userId = user._id;
    
        const purchase = new Purchase({
            user: userId,
            products: productsToPurchase.map(item => ({
            product: item.product,
            productQuantity: item.quantity,
            })),
        });
    
        const ticket = new Ticket({
            code: generateRandomCode(10),
            purchaseDatetime: new Date().toLocaleString(),
            amount: totalPurchaseAmount,
            purchaser: userId,
            purchaserDetails: userDTO.currentUser,
            products: productsToPurchase.map(item => ({
            id: item.product,
            product: item.product.title,
            productQuantity: item.quantity,
            productTotal: item.product.price * item.quantity,
            })),
        });
    
        await ticket.save();
        await purchase.save();
    
        await cartManager.clearCart(cid);
        await cartManager.updatePurchasedCart(cid, productsToKeepInCart, totalPurchaseAmount);
    
        logger.info("Compra generada con éxito!");
        return res.render('purchase', { ticket });
  
    } catch (error) {
      return res.status(500).json({ status: 'Internal Server Error', message: error.message });
    }
  };