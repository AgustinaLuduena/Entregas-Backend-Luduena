import mongoose from "mongoose";

const { Schema } = mongoose;

const collection = 'Users';

const schema = new Schema({
  first_name: {
    type: String,
    index: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  role: {
    type: String,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
  }
});


const userModel = mongoose.model(collection,schema);

export default userModel;