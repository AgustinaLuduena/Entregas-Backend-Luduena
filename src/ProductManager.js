//import { response } from "express";
import fs from "fs";
import __dirname from "./utils.js";

export default class ProductManager{
    constructor(){
        this.path = `${__dirname}/data/products.json`;
    }
    
    getInfo = async () => {
        let response = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(response);
    }

    addProduct = async (
        
        title,
        description,
        code,
        price,
        status = true,
        stock,
        category,
        thumbnail = "Not available" ) => {
        
        let listOfProducts = await this.getInfo()
         
        if (listOfProducts.some((product) => product.code === code)) {
            return false;
        } 
        
        const product = {
        id: await this.generateId(),
        title: title,
        description: description,
        code: code, 
        price: price,
        status: status,
        stock: stock,
        category: category,
        thumbnail: thumbnail,
        };

        listOfProducts.push(product);

        await this.saveProductsToFile(listOfProducts);
        return true;
    
    }    
    

    saveProductsToFile = async (products) => {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }
    
    generateId = async() => {
        let listOfProducts = await this.getInfo()

        let id = 0;
    
        if (listOfProducts.length === 0) {
        id = 1;
        } else {
        id = listOfProducts[listOfProducts.length - 1].id + 1;
        }
    
        return id;
    }

    
    getProducts = async () => {
        let listOfProducts = await this.getInfo()
        return listOfProducts
    } 

    getProductByID = async (id) => {
        let listOfProducts = await this.getInfo()
        let find = listOfProducts.find((producto) => producto.id === id)
        if(!find){
            return `ID NUMBER ${id} NOT FOUND.`
        } else {
            return find
        }
    }
        

    deleteProduct = async (id) => {
        let listOfProducts = await this.getInfo()

        const index = listOfProducts.findIndex(product => product.id === id);

        if (index === -1) {
            return false;
        }

        listOfProducts.splice(index, 1);
    
        await this.saveProductsToFile(listOfProducts);
        return true;    
    }
    
    updateProduct = async (id, updatedFields) => {
        let listOfProducts = await this.getInfo();

        let index = listOfProducts.findIndex(product => product.id === id);

        if (index === -1) {
            return false;
        }

        Object.assign(listOfProducts[index], updatedFields);
       
        await this.saveProductsToFile(listOfProducts); 
        return true;       
    }
  
    
    
}


//const eventManager = new ProductManager()

//Empty array
    //eventManager.getProducts()

//Add products ok
  /*
  eventManager.addProduct("Pencil", "Red color pencil", 200, 100, 20)
  eventManager.addProduct("Pencil", "Blue color pencil", 200, 101, 20)
  eventManager.addProduct("Pencil", "Yellow color pencil", 200, 102, 20)
  eventManager.addProduct("Pencil", "Green color pencil", 200, 103, 15)
  eventManager.addProduct("Pencil", "Orange color pencil", 200, 104, 15)
  eventManager.addProduct("Pencil", "Purple color pencil", 200, 105, 15)
  eventManager.addProduct("Pen", "Red color pen", 200, 106, 15)
  eventManager.addProduct("Pen", "Blue color pen", 200, 107, 30)
  eventManager.addProduct("Pen", "Green color pen", 200, 108, 15)
  eventManager.addProduct("Pen", "Purple color pen", 200, 109, 15)
  eventManager.addProduct("Pen", "Black color pen", 200, 110, 30)
  */

//Add products wrong
    //eventManager.addProduct("Pen", "Black color pen", 106,50)

//Add products repeated code
    //eventManager.addProduct("Pen", "Pink color pen", 300, 105,20)

 
//Search product by ID
    // eventManager.getProductByID(2)
    // eventManager.getProductByID(7)

/*
//Update product
    eventManager.updateProduct({
        id: 2,
        title: 'Higlighter',
        description: 'Orange color',
    })
*/
//Delete product by ID
    //eventManager.deleteProduct(9)
    //eventManager.deleteProduct(5)
