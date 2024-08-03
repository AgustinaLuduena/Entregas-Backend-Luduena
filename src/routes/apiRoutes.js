//Routes
import viewsRouter from "./viewsRouter.js";
import productsRouter from './productsRouter.js';
import cartsRouter from './cartsRouter.js';
import sessionsRouter from './sessionsRouter.js';
import categoryRouter from "./categoryRouter.js";
import userRouter from "./userRouter.js";
import mockingRouter from "./mockingRoter.js"
//Logger Testing
import logger from "../utils/logger-env.js";
//Mailing Service
// import MailingService from "../services/mailing.js";

// const service = new MailingService()

const router = (app) => {
    app.use(viewsRouter);
    app.use("/api/sessions", sessionsRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/api/products", productsRouter);
    app.use("/api", categoryRouter);
    app.use("/api", userRouter);
    app.use("/api", mockingRouter);

    //LoggerTest Endpoint
    app.get("/loggerTest", (req, res) => {
      try {
        //All levels of loggers
        logger.fatal("Este es un mensaje de testing: fatal");
        logger.error("Este es un mensaje de testing: error");
        logger.warning("Este es un mensaje de testing: advertencia");
        logger.info("Este es un mensaje de testing: información");
        logger.http("Este es un mensaje de testing: http");
        logger.debug("Este es un mensaje de testing: depuración");


        res.status(200).json({message: "Logs probados correctamente. Revise su consola para visualizarlos."});
      } catch (error) {
        logger.error("Error al probar los logs:", error);
        res.status(500).json({message: "Error al probar los logs"});
      }
    });
  };
  
  export default router;
  