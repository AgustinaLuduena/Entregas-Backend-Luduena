<h1 align="center">Práctica de Integración - Programación Backend</h1>
<h2 align="center">Agustina Ludueña</h2>
<p align="center">Cursada 2024</p>

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> </p>

<h3 align="left">Routes of the project:</h3>
<h2 align="left">Puerto: 8081</h2>

<h3>MONGO DB</h3>

<h4>app.use(viewsRouter) - Desestimar por ahora. No funcionan bien.</h4>
<p>GET "/" : Show the index page. Choose "log in" o "register".</p>
<p>GET "/login" : Show the login view.</p>
<p>GET "/register" : Show the register view.</p>
<p>GET "/products" : Show the products´ view page - as "guest" or after the log in. Funciona por Postman, luego de logrearse.</p>
<p>GET "/profile" : Show the profile view only after you log in. Funciona por Postman, luego de logrearse.</p>

<h4>app.use("/api/carts", cartsRouter);</h4>
<p>POST "/" : Add a new cart (Cart Id + products:[])</p>
<p>GET "/list" : List of carts (ADMIN ONLY)</p>
<p>GET "/:cid/" : List of products inside the cart chosen by Id</p>
<p>POST "/:cid/product/:pid/" : Add the chosen product to chosen the cart (Object [productId:id + quantity]) (USER ONLY)</p>
<p>DELETE "/:cid/product/:pid/" : Delete the chosen product from the chosen cart (Object [productId:id + quantity]) (USER ONLY)</p>
<p>DELETE "/:cid" : Delete all products from the cart (USER ONLY)</p>
<p>PUT "/:cid" : Update the cart using the specific array of products format with req.body (USER ONLY) </p>
<p>PUT "/:cid/products/:pid" : Update just the quantity of the chosen product with req.body (USER ONLY)</p>
<p>GET "/:cid/purchase" : Generate de purchase and the ticket. Use it by Postman (USER ONLY)</p>


<h4>app.use("/api/products", productsRouter);</h4>
<p>GET "/" : List of products, page, limit, query, and sort</p>
<p>GET "/categories" : List of products and the detail of the category (from category.model - without paginate)</p>
<p>GET "/:pid/" : Product by ID</p>
<p>POST "/" : Add a new product (ADMIN ONLY)</p>
<p>PUT "/:pid/" : Update a product by ID (ADMIN ONLY)</p>
<p>DELETE "/:pid/" : Delete product by ID (ADMIN ONLY)</p>

<h4>app.use("/api", userRouter);</h4>
<p>GET "/users" : List of user in the db and the detail of the cart asociated (ADMIN ONLY)</p>
<p>GET "/user/:id" : Data of the chosen user in the db</p>
<p>POST "/user" : Create a new user to the db with a cart from the cart.model.</p>
<p>PUT "/user/:id" : Update data of the chosen user in the db</p>
<p>DELETE "/user/:id" : Delete the chosen user from the db</p>


<h4>app.use("/api/sessions", sessionsRouter);</h4>
<p>POST "/login" : Log in as "user" or "admin" using "req.body" by Postman.</p>
<p>GET "/logout" : Destroy the current session and show the login view by Postman.</p>
<p>GET "/current" : Show the current session data with DTO.</p>

<h4>app.use("/api", categoryRouter);</h4>
<p>GET "/categories" : List of categories existing in the db</p>
<p>GET "/category/:id" : Category by ID</p>
<p>POST "/category" : Create category (ADMIN ONLY)</p>
<p>PUT "/category/:id" : Update Category by ID (ADMIN ONLY)</p>
<p>DELETE "/category/:id" : Delete Category by ID (ADMIN ONLY)</p>

<h4>app.use("/api", mockingRouter);</h4>
<p>GET "/mockingproducts" : List of 100 products created with Faker.</p>

<h3>SOCKET IO</h3>
<p>app.use(viewsRouter);</p>
<p>GET "/api/products/realTimeProducts" : Shows the list of products from JSON file (no MONGODB) and the form to add a new one to the file - The view is not working correctrly because of some problems with Socket.io</p>
<p>GET "/api/messages/" : Show the form to send a new message that will be added to the data base with MongoDB - The view is not working correctrly because of some problems with Socket.io, but you can use the form correctly to use the MongoDB.</p>


