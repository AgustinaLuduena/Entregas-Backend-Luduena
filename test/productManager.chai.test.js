//Database
import mongoose from "mongoose";
import config from "../src/config/config.js";
//Products Manager
import { productManager } from '../src/dao/factory.js';
//Testing tools
import { expect } from 'chai';

//Contect to Mongo DB
const connection = mongoose.connect(config.mongo_url);

describe("Product Manager (DAO) test (Using CHAI)", async function () {
    this.timeout(5000);

    afterEach(async function () {
        await mongoose.connection
            .collection("products")
            .deleteMany({ title: "Testing product" });
    });

    it("getProducts method must not return an array of products when is called", async function () {
        const result = await productManager.getProducts();
        expect(Array.isArray(result)).to.be.equal(false);
    });

    it("addProduct method must add a new product", async function () {
        const testProduct = {
            title: "Testing product",
            description: "Necesita una descripción", 
            code : 1320,
            price: 4500,
            status : true,
            stock: 10,
            category: "66314a18b4275625c52199ee",
            colors: ["amarillo", "rojo"],
            sizes: ["S", "M"]
        };

        const result = await productManager.addProduct(testProduct);

        expect(result).to.have.property("_id");
        expect(result._id).to.be.ok;
        expect(result.title).to.be.equal("Testing product");
        expect(result).to.have.property("status")
        expect(result).to.have.property("owner")
    });

    it("getProductById method must receive a string", async function () {
        //A real ID was given for this test
        let pid = "66315b1a789d7a753fb0a8a8"
        const result = await productManager.getProductByID(pid);
        expect(pid).to.be.a("string");
        expect(result).to.be.ok;
        expect(result).to.have.property("status").and.to.be.equal(true);
    });
});