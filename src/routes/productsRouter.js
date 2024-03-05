import { Router } from 'express'
//import fs, { writeFileSync } from "fs";
//import __dirname from "../utils.js";
import validateUpdateFields from '../middlewares/validateUpdateFields.js';
import validateFields from '../middlewares/validateFields.js';
import ProductManager from '../ProductManager.js';

const productsRouter = Router()
const productManager = new ProductManager();
//const pathProducts = `${__dirname}/data/products.json`


productsRouter.get('/', async (req, res) => {
//List of products & limit
try {
    const products = await productManager.getProducts();

    let limit = req.query.limit;
    let limitedProducts = products.slice(0,limit)

    res.json({limitedProducts})

} catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
}
});
  

productsRouter.get("/:pid/", async (req, res) => {
    //Product by ID
    try {
        let pid =  parseInt(req.params.pid)
        const product = await productManager.getProductByID(pid);
        if(!product){
            return res.status(400).send({ status: `ID NUMBER ${pid} NOT FOUND.`});
        } else {
            return res.json(product);
        }

      } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
      }
    });
    


productsRouter.post('/', validateFields, async (req, res) => {
    //Add a new product
    try {
        let { title, description, code, price, status, stock, category, thumbnail } = req.body;

        const addedSuccessfully = await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);
        
        if (addedSuccessfully) {
            return res.status(200).send({ status: `Product with title: ${title}, was successfully created.` });
        } else {
            return res.status(400).send({ error: `The code ${code} already exists.` });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

    /* Modelo de datos para testear por Postman el "req.body"

        {
        "title" : "product5",
        "description" : "Necesita una description",
        "code": 105,
        "price": 500,
        "stock": 20,
        "category": "No tiene aún"
        }

    */


    
productsRouter.put("/:pid/", validateUpdateFields, async (req, res) => {
    try {
        let pid = parseInt(req.params.pid);
        let updatedFields = req.body;

        const updateSuccessfully = await productManager.updateProduct(pid, updatedFields);

        if (updateSuccessfully) {
            return res.status(200).send({ status: `Product with ID ${pid} was successfully updated.` });
        } else {
            return res.status(404).send({ error: `Product with ID ${pid} was not found.` });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});
        


productsRouter.delete("/:pid/", async (req, res) => {

    //Delete product by ID
    try {
        let pid =  parseInt(req.params.pid)
        const selectedProduct = await productManager.deleteProduct(pid);
        
        if(!selectedProduct){
            return res.status(400).send({ status: `Cannot delete product. Product with ID ${pid} not found.`});
        } else {
            return res.status(200).send({status: `Product with ID ${pid} deleted successfully.`});
        }
      } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
      }

});

export default productsRouter
