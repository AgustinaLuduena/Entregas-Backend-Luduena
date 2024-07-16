//Database
import mongoose from "mongoose";
import config from "../src/config/config.js";
//Products Manager
import { productManager } from '../src/dao/factory.js';
//Testing tools
import Assert from "assert";
import { describe, it } from "mocha";

//Contect to Mongo DB
const connection = mongoose.connect(config.mongo_url);

const assert = Assert.strict;

describe("Product Manager test (Using Assert)", async function () {
    this.timeout(5000);

    afterEach(async function () {
        await mongoose.connection
            .collection("products")
            .deleteMany({ title: "Testing product" });
    });

    it("getProducts method must not return an array of products when is called", async function () {
        const result = await productManager.getProducts();
        assert.strictEqual(Array.isArray(result), false);
    });

    it("DAO: addProduct method must add a new product", async function () {
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

        assert.ok(result._id);
        assert.ok(result.title);
        assert.equal(result.title, "Testing product");
    });
});

