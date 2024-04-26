//Routes
import viewsRouter from "./viewsRouter.js";
import productsRouter from './productsRouter.js';
import cartsRouter from './cartsRouter.js';
import sessionsRouter from './sessionsRouter.js';

const router = (app) => {
    app.use(viewsRouter);
    app.use("/api/sessions", sessionsRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/api/products", productsRouter);
  };
  
  export default router;
  