import __dirname from './utils.js';
import connectDb from './config/database.js';
import router from './routes/apiRoutes.js';
import middlewares from './config/middlewaresConfig.js';
import createExpressApp from './config/createApp.js';
import socketServer from './config/createSocket.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

async function main(){
  const app = createExpressApp()

  //Contect to Mongo DB
  await connectDb()

  //Global middlewares
  middlewares(app)

  //Global Routes
  router(app)

  //ErrorHandler
  app.use(errorHandler) 

  //SocketIO
  socketServer()

}

main()

