import mongoose from "mongoose";
const { Schema } = mongoose

const collection = "Carts";

const cartsSchema = new Schema({
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

const cartsModel = mongoose.model(collection, cartsSchema);

export default cartsModel

