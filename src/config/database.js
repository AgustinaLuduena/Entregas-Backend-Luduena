import mongoose from 'mongoose';
import config from './config.js';

const connectDb = async () => {
  try {
    await mongoose.connect(config.mongo_url);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log("error de conexion");
  }
};
export default connectDb;