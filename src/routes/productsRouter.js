import { Router } from 'express'
const productsRouter = Router()


//Test
/* 
productsRouter.get("/", (req, res) => {
    res.send("Aquí debe listar todos los productos")
})


productsRouter.get("/:pid/", (req, res) => {
    res.send("Aquí debe traer solo el producto del id seleccionado")
})

productsRouter.post("/", (req, res) => {
    res.send("Debe agregar un nuevo producto cumpliendo con los campos")
})

productsRouter.put("/:pid/", (req, res) => {
    res.send("Debe actualizar un producto respetando el id")
})

productsRouter.delete("/:pid/", (req, res) => {
    res.send("Deberá eliminar el producto con el pid indicado")
})
*/

//Ejemplo de clase con los pets
let products = []

productsRouter.get("/", (req, res)=>{

    res.json({products})

})  

productsRouter.post("/", (req, res)=>{

    const product = req.body 
    products.push(product)
    res.json({status: "succes"})

})  


export default productsRouter