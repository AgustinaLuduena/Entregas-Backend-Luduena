import { Router } from "express";

const viewsRouter = Router()


viewsRouter.get("/realTimeProducts", async (req,res)=>{

    res.render('realTimeProducts')

})


export default viewsRouter;