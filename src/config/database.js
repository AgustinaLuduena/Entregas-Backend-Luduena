import mongoose from 'mongoose';
//config
import config from './config.js';
//Logger
import logger from '../utils/logger-env.js';

const connectDb = async () => {
  try {
    await mongoose.connect(config.mongo_url);
    logger.info("Conectado a MongoDB");
  } catch (error) {
    logger.error("Error de conexion a DB:", error);
  }
};
export default connectDb;