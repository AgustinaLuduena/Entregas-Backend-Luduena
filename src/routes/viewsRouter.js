import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { active } from "../middlewares/activeSession.js";
import DBChatManager from "../dao/services/DBChatManager.js";
import DBProductManager from "../dao/services/DBProductManager.js";
import CartManager from '../dao/services/DBCartManager.js';


const viewsRouter = Router();

//INDEX
viewsRouter.get('/', active, (req, res) => {
    try {
      res.render('index', {title: "Home"});
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });

//SESSION and PROFILE
viewsRouter.get("/register", active, (req, res) => {
  res.render("register");
});

viewsRouter.get("/login", active, (req, res) => {
  res.render("login");
});

viewsRouter.get("/profile", auth ,(req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});


// REAL TIME PRODUCTS (FS)
viewsRouter.get("/api/products/realTimeProducts", async (req,res)=>{
    //Muestra el listado de productos del JSON y el formulario para agregar uno nuevo (NO MONGO DB). Ya no funciona porque no funciona socket.io
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

// PRODUCTS VIEW Route
const DBproductManager = new DBProductManager();

viewsRouter.get('/products', async (req, res) => {
  // List of products, page, limit, query, and sort usando HANDLEBARS
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let category = req.query.category;
  let sort = req.query.sort;
  
  let user = req.session.user;

  try {
      if (isNaN(page) || page < 1) { page = 1 };
      if (isNaN(limit) || limit < 1) { limit = 10 };

      let result;
      if (category) {
          result = await DBproductManager.getProductsByCategory(category);

          if (!result) {
              return res.status(400).send({ status: `Para la categoría: ${category}, no hay stock disponible.` });
          } else {
              return res.json(result);
          }
      } else {
          if (sort === 'asc' || sort === 'desc') {
              result = await DBproductManager.getProducts(page, limit, { price: sort === 'asc' ? 1 : -1 });
          } else {
              result = await DBproductManager.getProducts(page, limit);
          }

          // View
          result.isValid = page >= 1 && page <= result.totalPages;
          result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort}` : "";
          result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort}` : "";

          //console.log(result);
          res.render('products', {
            user: user,
            products: result.docs
          });

          //Console response
          const status = result.isValid ? "success" : "error";
          const totalPages = result.totalPages;
          const hasNextPage = result.hasNextPage;
          const hasPrevPage = result.hasPrevPage;
          const prevPage = result.hasPrevPage ? result.prevPage : null;
          const nextPage = result.hasNextPage ? result.nextPage : null;
          const prevLink = result.hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null;
          const nextLink = result.hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null;
  
          const responseObject = {
              status, 
              payload: result.docs,
              totalPages,
              prevPage,
              nextPage,
              page,
              hasPrevPage,
              hasNextPage,
              prevLink,
              nextLink
          };
          //console.log(responseObject); 
      }  

  } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
  }
});

// CART VIEW Route
const DBcartsManager = new CartManager();

viewsRouter.get("/carts/:cid/", auth, async (req, res) => {

    //List of products inside the cart chosen by Id
    //Example cart id: 661404ba661a8432389a150f
    try {
        let cid =  req.params.cid
        const cart = await DBcartsManager.getCartById(cid);

        if(!cart){
          return res.json(`Cart Id number ${cid} does not been found.`)
        }

        if (req.accepts("html")) {
          return res.render("cart", { cart: cart });
        } else {
          return res.json(cart);
        }
        

      } catch (err) {
        console.error('Error:', err);
        res.status(500).json('Internal Server Error');
      }
})  

viewsRouter.get("/restore", (req, res) => {
  res.render("restore");
});


export default viewsRouter;


