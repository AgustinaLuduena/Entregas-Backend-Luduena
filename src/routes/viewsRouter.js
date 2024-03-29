import { Router } from "express";
import DBChatManager from "../dao/services/DBChatManager.js";

const viewsRouter = Router();

//INDEX
viewsRouter.get('/', (req, res) => {
    try {
      res.render('index', {title: "Home"});
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });

viewsRouter.get("/api/products/realTimeProducts", async (req,res)=>{
    //Muestra el listado de productos del JSON y el formulario para agregar uno nuevo (NO MONGO DB)
    try{
        res.render('realTimeProducts')

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
    
});

// CHAT Routes
viewsRouter.get("/api/messages/", DBChatManager.getMessages);

viewsRouter.post("/api/messages/addMessage", DBChatManager.addMessage);



export default viewsRouter;


