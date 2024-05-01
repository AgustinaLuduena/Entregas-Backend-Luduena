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
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
    default: "66062c3ce26a5ce67ecbb893"
  }
});


const userModel = mongoose.model(collection,schema);

export default userModel;