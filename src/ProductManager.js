import fs from "fs";
import __dirname from "./dirname.js";

export default class ProductManager{
    constructor(){
        this.path = `${__dirname}/dao/data/products.json`;
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

