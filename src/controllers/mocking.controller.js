import { generateProducts } from "../utils.js";

//get mocking products
export const getMock = async (req, res) => {
    try {
        let products = [];
        for (let i = 0; i < 101; i++) {
            products.push(generateProducts());
        }
        res.send({ status: "success", payload: products });
      } catch (error) {
        res.status(500).json({ error: `Error al generar los productos` });
      }
}
