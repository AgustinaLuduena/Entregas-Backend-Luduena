import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    user: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User'
        type: String,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            unitPrice: Number,
            totalPrice: Number
        }
    ],
    purchaseDate: {
        type: Date,
        default: Date.now
    }
});


const Purchase = mongoose.model("Purchase", purchaseSchema);


export default Purchase;