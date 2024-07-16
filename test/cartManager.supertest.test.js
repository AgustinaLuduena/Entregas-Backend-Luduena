//Database
import mongoose from "mongoose"
import config from "../src/config/config.js";
//Testing tools
import { expect } from 'chai';
import supertest from 'supertest';
//Products Manager
import { userManager } from '../src/dao/factory.js';

const request = supertest("http://localhost:8081")

//Testing data
const dbProduct = {
    _id: "66314df6acb3b7caac87f631",
    title: "Calza Nike",
    description: "Calza larga con logo Nike",
    code: "100",
    price: 2000,
    status: true,
    stock: 10,
    category: "deportiva",
    colors: [
        "verde",
        "negro"
    ],
    sizes: [
        "L",
        "M"
    ],
    __v: 0,
    id: "66314df6acb3b7caac87f631"
}

const userCredentials = {
    //Premium user
    email: 'may@mail.com',
    password: '123'
};

let cookie;
let userCart;

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

describe("Pruebas para CRUD de carritos", function () {
    this.timeout(5000);

    describe("Trabaja con el carrito del usuario activo", () => {
        it("El endpoint /api/carts/:cid debe mostrar el carrito del usuario", async function () {
            try {
                const existingUser = await userManager.getByEmail(userCredentials.email);
                expect(existingUser).to.be.ok;
                expect(existingUser.email).to.equal("may@mail.com");
                expect(existingUser.last_name).to.equal("Orca");

                userCart = existingUser.cart;

                const result = await request.get(`/api/carts/${userCart}`);
                expect(result.statusCode).to.equal(200);
                console.log("Carrito:", result.text);
            } catch (error) {
                console.error("Error durante la solicitud al endpoint:", error);
                throw error;
            }
        });

        it("El endpoint /api/carts/:cid/product/:pid debe agregar el producto al carrito del usuario", async function () {
            try {
                expect(dbProduct).to.be.an("object")

                let productId = dbProduct.id;
                
                if(dbProduct.stock > 0){
                    const result = await request.post(`/api/carts/${userCart}/product/${productId}`).set('Cookie', cookie);
                    console.log("Producto agregado al carrito:", result.text);
                } else {
                    console.log("No hay suficiente stock de este producto para agregarlo al carrito.");
                }

            } catch (error) {
                console.error("Error durante la solicitud al endpoint:", error);
                throw error;
            }
        });
    });


});
