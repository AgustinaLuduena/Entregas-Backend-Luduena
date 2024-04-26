import __dirname from './utils.js';
import connectDb from './config/database.js';
import router from './routes/apiRoutes.js';
import middlewares from './config/middlewaresConfig.js';
import createExpressApp from './config/createApp.js';
import socketServer from './config/createSocket.js';

async function main(){
  const app = createExpressApp()

  //Contect to Mongo DB
  await connectDb()

  //Global middlewares
  middlewares(app)

  //Global Routes
  router(app)

  socketServer()

}

main()

