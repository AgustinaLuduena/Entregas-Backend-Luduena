import { Router } from 'express'
import fs, { writeFileSync } from "fs";
import __dirname from "../utils.js";
import validateFields from '../middlewares/validateFields.js';

const productsRouter = Router()
const pathProducts = `${__dirname}/data/products.json`


productsRouter.get("/", (req, res) => {
    //List of products
    let readProducts = fs.readFileSync(pathProducts, "utf-8")
    let parsedProducts = JSON.parse(readProducts)

    //Limit
    let limit = req.query.limit;
    let limitedProducts = parsedProducts.slice(0,limit)

    res.json({limitedProducts})
})


productsRouter.get("/:pid/", (req, res) => {

    //Product by ID
    let pid =  parseInt(req.params.pid)
    let readProducts = fs.readFileSync(pathProducts, "utf-8")
    let parsedProduct = JSON.parse(readProducts)

    let filteredProduct = parsedProduct.find((product) => product.id === pid)

    if(!filteredProduct) return res.send(`Error. Product Id number ${pid} not found.`)
    res.json(filteredProduct)
})


productsRouter.post("/", validateFields, (req, res) => {

    //Add a new product
    let readProducts = fs.readFileSync(pathProducts, "utf-8")
    let parsedProducts = JSON.parse(readProducts)

    let generateId = () => {
        let id = 0;

        if (parsedProducts.length === 0) {
            id = 1;
        } else {
            id = parsedProducts[parsedProducts.length - 1].id + 1;
        }
        return id;
    }

    let product = req.body 

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
    
    if (parsedProducts.some((p) => p.code === product.code)) {
        return res.status(400).send({ status: `The code ${product.code} already exists.`});
    } else if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category){
        return res.status(400).send({ status: "Error. Please, complete all the information of the new product." });
        //Se puede mejorar con un Object.values?
    }else {
        let loadedProduct = {
            id: generateId(),
            title : product.title,
            description : product.description,
            code: product.code,
            price: product.price,
            status: true,
            stock: product.stock,
            category: product.category,
            thumbnail: "Image not available"
            }
        parsedProducts.push(loadedProduct);
        let data = JSON.stringify(parsedProducts)
        writeFileSync(pathProducts, data, null)
        res.status(200).send({ status: "Product succesfully created. Your product information is: " + JSON.stringify(loadedProduct) });
    }


})


productsRouter.put("/:pid/", validateFields, (req, res) => {
    
    //Update products fields by ID
    let pid = parseInt(req.params.pid);
    let readProducts = fs.readFileSync(pathProducts, "utf-8");
    let parsedProducts = JSON.parse(readProducts);

    let foundProductIndex = parsedProducts.findIndex(product => product.id === pid);

    if (foundProductIndex === -1) {
        return res.status(404).send(`Product with ID ${pid} not found.`);
    }

    let updatedProduct = parsedProducts[foundProductIndex];
    let fieldsToUpdate = req.body;

    Object.keys(fieldsToUpdate).forEach(field => {
        if (fieldsToUpdate[field] !== undefined) {
            updatedProduct[field] = fieldsToUpdate[field];
        }
    });

    parsedProducts[foundProductIndex] = updatedProduct;
    let updatedData = JSON.stringify(parsedProducts);
    writeFileSync(pathProducts, updatedData, null);

    res.status(200).send(`Product with ID ${pid} updated successfully.`);
});


productsRouter.delete("/:pid/", (req, res) => {

    //Delete product by ID
    let pid = parseInt(req.params.pid);
    let readProducts = fs.readFileSync(pathProducts, "utf-8");
    let parsedProducts = JSON.parse(readProducts);

    let foundProductIndex = parsedProducts.findIndex(product => product.id === pid);

    if (foundProductIndex === -1) {
        return res.status(404).send(`Product with ID ${pid} not found.`);
    }

    parsedProducts.splice(foundProductIndex, 1);

    let updatedData = JSON.stringify(parsedProducts);
    writeFileSync(pathProducts, updatedData, null);

    res.status(200).send(`Product with ID ${pid} deleted successfully.`);

});

export default productsRouter
