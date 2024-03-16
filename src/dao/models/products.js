import mongoose from "mongoose";
const { Schema } = mongoose

const collection = "Products"

const schema = new Schema({

    //El ID lo genera Mongoose

    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean
    },
    stock: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    thumbnails: {
        type: [String]
    }

})

const productsModel = mongoose.model(collection, schema)

export default productsModel
