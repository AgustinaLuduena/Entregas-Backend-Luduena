import { Router } from 'express'
import validateUpdateFields from '../middlewares/validateUpdateFields.js';
import validateFields from '../middlewares/validateFields.js';
import DBProductManager from '../dao/controllers/DBProductManager.js';

const productsRouter = Router()
const DBproductManager = new DBProductManager();


productsRouter.get('/', async (req, res) => {
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
            result = await DBproductManager.getProductsByCategory(category);

            if (!result) {
                return res.status(400).send({ status: `Para la categoría: ${category}, no hay stock disponible.` });
            } else {
                return res.json(result);
            }
        } else {
            if (sort === 'asc' || sort === 'desc') {
                result = await DBproductManager.getProducts(page, limit, { price: sort === 'asc' ? 1 : -1 });
            } else {
                result = await DBproductManager.getProducts(page, limit);
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
            console.log(responseObject);
        }  

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal Server Error');
    }
});


//get products with categories details
productsRouter.get("/categories", async (req, res) => {
  try {
    const products = await DBproductManager.getAllProductsWithCategories();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: `Error al recibir los productos` });
  }
});

productsRouter.get("/:pid/", async (req, res) => {
    //Product by ID
    try {
        let pid =  req.params.pid
        const product = await DBproductManager.getProductByID(pid);

        if(!product){
            return res.status(400).json({ status: `ID NUMBER ${pid} NOT FOUND.`});
        } else {
            return res.json(product);
        }

      } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal Server Error');
      }
    });
    


productsRouter.post('/', async (req, res) => {
    //Add a new product        
    try {
        const newProduct = req.body
        let addedSuccessfully = await DBproductManager.addProduct(newProduct);
        
        if (addedSuccessfully) {
            return res.status(200).json({ status: `Product with title: ${newProduct.title}, was successfully created.` });
        } else {
            return res.status(400).json({ error: `The code ${newProduct.code} already exists.` });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal Server Error');
    }
});

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


    
productsRouter.put("/:pid/", validateUpdateFields, async (req, res) => {
     //Revisar si funciona el validateUpdateFields

    //Update a product
    try {
        let pid = req.params.pid;
        let productData = req.body;

        const updateSuccessfully = await DBproductManager.updateProduct(pid, productData)

        if (updateSuccessfully) {
            return res.status(200).json({ status: `Product with ID ${pid} was successfully updated.` });
        } else {
            return res.status(404).json({ error: `Product with ID ${pid} was not found.` });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal Server Error');
    }
});
        


productsRouter.delete("/:pid/", async (req, res) => {

    //Delete product by ID
    try {
        let pid =  req.params.pid
        const selectedProduct = await DBproductManager.deleteProduct(pid);
        if(!selectedProduct){
            //No logra dar respuesta en caso de no encontrarlo.
            return res.status(400).json({ status: `Cannot delete product. Product with ID ${pid} not found.`});
        } else {
            return res.status(200).json({status: `Product with ID ${pid} deleted successfully.`});
        }
      } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal Server Error');
      }

});

export default productsRouter
