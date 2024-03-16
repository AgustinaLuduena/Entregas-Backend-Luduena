import { Router } from "express";

const viewsRouter = Router()


viewsRouter.get("/realTimeProducts", async (req,res)=>{

    res.render('realTimeProducts')

})

viewsRouter.get('/chat',(req,res)=>{

    res.render('chat');
    
})

export default viewsRouter;

