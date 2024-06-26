//Factory
import { productManager, cartManager } from "../dao/factory.js";
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
        res.render("register");
    } catch (err) {
        logger.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
}

export const login = async (req, res) => {
    try{
        res.render("login");
    } catch (err) {
        logger.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
}

export const profile = async (req, res) => {
    //Tengo problemas con esta vista
    try{
        let user = req.user ? req.user : null;
        res.render("profile", { user: user });
    } catch (err) {
        logger.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
}

export const realTimeProducts = async (req, res) => {
    //Muestra el listado de productos del JSON y el formulario para agregar uno nuevo (NO MONGO DB). Ya no funciona porque no funciona socket.io
    try{
        res.render('realTimeProducts')

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
    
    //Tengo problemas con esta vista
    // let id = req.user
    // console.log(id)
    // let userLog = await userManager.getById(id)
    
    let user = req.user ? req.user : null;

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

            logger.info(user);
            // res.render('products', {
            //     user: user,
            //     products: result.docs
            // });

            res.render('products', {
                user: user,
                products: result.docs,
                hasPrevPage: result.hasPrevPage,
                prevLink: result.prevLink,
                page: result.page,
                hasNextPage: result.hasNextPage,
                nextLink: result.nextLink
            });

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
            //console.log(responseObject); 
        }  

    } catch (err) {
        logger.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
}
export const getCartById = async (req, res) => {
    //List of products inside the cart chosen by Id
    //Example cart id: 661404ba661a8432389a150f
    try {
        let cid =  req.params.cid
        const cart = await cartManager.getCartById(cid);

        if(!cart){
          throw CustomError.CustomError(
            "Error", `Cart id ${cid} was not found.`,
            errorTypes.ERROR_NOT_FOUND, 
            notFound(cid))
        }

        if (req.accepts("html")) {
          return res.render("cart", { cart: cart });
        } else {
          return res.json(cart);
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