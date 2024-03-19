import { Router } from "express";
//import DBChatManager from "../dao/services/DBChatManager.js";

const viewsRouter = Router();
//const DBchatManager = new DBChatManager();

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
viewsRouter.get('/chat', async (req,res)=>{
    //Muestra un log in simple y un input que permite randerizar mensajes en la pantalla a través de socket io

    try{
        res.render('chat');

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
    
    
})

/* 

viewsRouter.post('/chat', async (req,res)=>{
    //Add new msg

    try{
        const newMsg = req.body
        let addNewMsg = await DBchatManager.newMessage(newMsg)
        
        if(addNewMsg) {
            return res.status(200).send({ status: `Message ${newMsg} exitosamente enviado.` });
        } else {
            return res.status(400).send({ error: `The message no fue enviado.` });
        }
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
    
    
})

*/

export default viewsRouter;

