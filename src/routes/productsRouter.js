import { Router } from 'express'
import validateUpdateFields from '../middlewares/validateUpdateFields.js';
import validateFields from '../middlewares/validateFields.js';
import DBProductManager from '../dao/services/DBProductManager.js';

const productsRouter = Router()
const DBproductManager = new DBProductManager();


productsRouter.get('/', async (req, res) => {
//List of products & limit
try {
    const products = await DBproductManager.getProducts();
    res.json({products})

} catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
}
});
  

productsRouter.get("/:pid/", async (req, res) => {
    //Product by ID
    try {
        let pid =  req.params.pid
        const product = await DBproductManager.getProductByID(pid);

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
    //Revisar si funciona el validateFields



    //Add a new product        
    try {
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


    
productsRouter.put("/:pid/", validateUpdateFields, async (req, res) => {
     //Revisar si funciona el validateUpdateFields

    //Update a product
    try {
        //quité el parseInt
        let pid = req.params.pid;
        let productData = req.body;

        const updateSuccessfully = await DBproductManager.updateProduct(pid, productData)

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
