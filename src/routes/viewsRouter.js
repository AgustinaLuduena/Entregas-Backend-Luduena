import { Router } from "express";
import DBChatManager from "../dao/services/DBChatManager.js";

const viewsRouter = Router();

viewsRouter.get("/realTimeProducts", async (req,res)=>{
    //Muestra el listado de productos del JSON y el formulario para agregar uno nuevo (NO MONGO DB)
    try{
        res.render('realTimeProducts')

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
    
})

// CHAT VIEWS
viewsRouter.get("/api/messages/", DBChatManager.getMessages);

viewsRouter.post("/api/messages/addMessage", DBChatManager.addMessage);



export default viewsRouter;

