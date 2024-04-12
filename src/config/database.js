import mongoose from 'mongoose';

const PASS_MONGO = "mongodb2024"
const DB_URL = `mongodb+srv://agusluduena4:${PASS_MONGO}@cluster0.egyfnzt.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`

const connectDb = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log("error de conexion");
  }
};
export default connectDb;