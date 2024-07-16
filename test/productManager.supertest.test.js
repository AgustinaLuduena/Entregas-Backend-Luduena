//Database
import mongoose from "mongoose"
import config from "../src/config/config.js";
//Testing tools
import { expect } from 'chai';
import supertest from 'supertest';
//Products Manager
import { productManager } from '../src/dao/factory.js';

const request = supertest("http://localhost:8081")

//Testing data
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

const userCredentials = {
    //Premium user
    email: 'test@example.com',
    password: '123'
};

let cookie;
let productId;

//Supertest
before(async function () {
    await mongoose.connect(config.mongo_url);

    const loginResponse = await request.post('/api/sessions/login').send(userCredentials);
    expect(loginResponse.statusCode).to.equal(200);
    console.log("Login exitoso:", loginResponse.body);

    const cookies = loginResponse.headers['set-cookie'];
    cookie = extractCookie(cookies, 'proyecto_backend');
    console.log("Cookie obtenida:", cookie);
});

function extractCookie(cookies, cookieName) {
    const cookie = cookies.find(c => c.startsWith(`${cookieName}=`));
    if (!cookie) {
        throw new Error(`No se encontró la cookie ${cookieName}`);
    }
    return cookie.split(';')[0];
}

describe("Pruebas para CRUD de productos", function () {
    this.timeout(5000);
    
    describe('Crear un nuevo producto', () => {
        it("Se debe crear un nuevo producto o buscar el que coincida con dicho titulo", async function (){
            try {
                const existingProduct = await productManager.getProductByTitle(testProduct.title);
    
                if (existingProduct) {
                    productId = existingProduct._id;
                    console.log("El producto ya existe:", existingProduct);
                } else {
                    const createProductResponse = await request.post('/api/products/').set('Cookie', cookie).send(testProduct);
                    expect(createProductResponse.statusCode).to.equal(200);
                    console.log("Producto creado:", createProductResponse.body);
                  
                    const result = await productManager.getProductByTitle(testProduct.title);
                    productId = result._id;
                }
            } catch (error) {
                console.error("Error durante la preparación del producto:", error);
                throw error;
            }
        })
    });

    describe("Ver los productos", () => {
        it("El endpoint /api/products/ debe mostrar la lista de productos", async function () {
            try {
                const productsList = await request.get("/api/products/");

                expect(productsList.statusCode).to.equal(200);
                console.log("Lista de los productos:", productsList.body);
            } catch (error) {
                console.error("Error en la búsqueda de los productos:", error);
                throw error;
            }
        });
        it("Mostrar la página 2 de la lista de productos", async function () {
            try {
                const productsList = await request.get("/api/products?page=2");

                expect(productsList.statusCode).to.equal(200);
                console.log("Lista de los productos:", productsList.body);
            } catch (error) {
                console.error("Error en la búsqueda de los productos:", error);
                throw error;
            }
        });
    });


    describe("Mostrar el producto creado", () => {
        it("El endpoint /api/products/:pid debe mostrar el producto creado", async function () {
            try {
                const productCreatedResponse = await request.get(`/api/products/${productId}`);
                expect(productCreatedResponse.statusCode).to.equal(200);
                console.log("Producto:", productCreatedResponse.text);
            } catch (error) {
                console.error("Error durante la solicitud al endpoint:", error);
                throw error;
            }
        });
    });

    



});


after(async function () {
    try {
        if (productId) {
            console.log(productId)
            await productManager.deleteProduct({ _id: productId });
            console.log(`Producto con ID ${productId} eliminado correctamente.`);
        } else {
            console.warn("No se encontró un productId válido para eliminar.");
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
    }
});