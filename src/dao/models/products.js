import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose

const collection = "Products"

const schema = new Schema({

    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    colors: {
        type: [String],
      },
    sizes: {
      type: [String], 
    },
    thumbnails: {
      type: [String],
    },
    owner: {
        type: String,
        require: true,
        default: "admin",
    },

})

//Paginate
schema.plugin(mongoosePaginate)

const productsModel = mongoose.model(collection, schema)

export default productsModel
