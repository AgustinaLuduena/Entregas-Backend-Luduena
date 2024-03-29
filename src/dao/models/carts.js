import mongoose from "mongoose";
const { Schema } = mongoose

const collection = "Carts";

const cartsSchema = new Schema({

    //Sería una buena práctica agregar el "type" a "products"? (Ver código de clase 17 min 38 de clase aprox)
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

//Middleware "populate"
//No permite utilizar una función flecha en este contexto
//Está comentado porque no utilicé un único find() como en el ejemplo de clase.
/* 
cartsSchema.pre("find", function(){
    this.populate("products.product")
})
*/


const cartsModel = mongoose.model(collection, cartsSchema);

export default cartsModel

