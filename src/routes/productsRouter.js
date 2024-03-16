import { Router } from 'express'
import validateUpdateFields from '../middlewares/validateUpdateFields.js';
import validateFields from '../middlewares/validateFields.js';
//import ProductManager from '../ProductManager.js';
import DBProductManager from '../dao/services/DBProductManager.js';

const productsRouter = Router()
//const productManager = new ProductManager();
const DBproductManager = new DBProductManager();


productsRouter.get('/', async (req, res) => {
//List of products & limit
try {
    const products = await DBproductManager.getProducts();
    //const products = await productManager.getProducts();

    //let limit = req.query.limit;
    //let limitedProducts = products.slice(0,limit)

    //res.json({limitedProducts})
    res.json({products})

} catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
}
});
  

productsRouter.get("/:pid/", async (req, res) => {
    //Product by ID
    try {
        //quité el parseInt
        let pid =  req.params.pid
        const product = await DBproductManager.getProductByID(pid);

        //const product = await productManager.getProductByID(pid);

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
    //No funciona el validateFields


    //Add a new product
        //const {title, description,code,category,brand,price,stock,status,thumbnails} = req.body
        
    try {
        //let { title, description, code, price, stock, category } = req.body;
        const newProduct = req.body
        let addedSuccessfully = await DBproductManager.addProduct(newProduct);
        
        if (addedSuccessfully) {
            return res.status(200).send({ status: `Product with title: ${newProduct.title}, was successfully created.` });
        } else {
            return res.status(400).send({ error: `The code ${newProduct.code} already exists.` });
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


    
productsRouter.put("/:pid/", async (req, res) => {
       //quité el validateUpdateFields
    try {
        //quité el parseInt
        let pid = req.params.pid;
        let productData = req.body;

        const updateSuccessfully = await DBproductManager.updateProduct(pid, productData)
        //const updateSuccessfully = await productManager.updateProduct(pid, updatedFields);

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
        //quité el parseInt
        let pid =  req.params.pid
        const selectedProduct = await DBproductManager.deleteProduct(pid);
        /* 
        let pid =  parseInt(req.params.pid)
        const selectedProduct = await productManager.deleteProduct(pid);
        */
        if(!selectedProduct){
            //No logra dar respuesta en caso de no encontrarlo.
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
