//Routes
import viewsRouter from "./viewsRouter.js";
import productsRouter from './productsRouter.js';
import cartsRouter from './cartsRouter.js';
import sessionsRouter from './sessionsRouter.js';
import categoryRouter from "./categoryRouter.js";
import userRouter from "./userRouter.js";

const router = (app) => {
    app.use(viewsRouter);
    app.use("/api/sessions", sessionsRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/api/products", productsRouter);
    app.use("/api", categoryRouter);
    app.use("/api", userRouter);
  };
  
  export default router;
  