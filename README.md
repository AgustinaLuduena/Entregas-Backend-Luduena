<h1 align="center">Práctica de Integración - Programación Backend</h1>
<h2 align="center">Agustina Ludueña</h2>
<p align="center">Cursada 2024</p>

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> </p>

<h3 align="left">Routes of the project:</h3>

<h3>MONGO DB</h3>

<h4>app.use(viewsRouter);</h4>
<p>GET "/" : Show the index page. Choose "log in" o "register".</p>
<p>GET "/login" : Show the login view.</p>
<p>GET "/register" : Show the register view.</p>
<p>GET "/products" : Show the products´ view page - as "guest" or after the log in.</p>
<p>GET "/profile" : Show the profile view only after you log in.</p>

<h4>app.use("/api/carts", cartsRouter);</h4>
<p>POST "/" : Add a new cart (Cart Id + products:[])</p>
<p>GET "/:cid/" : List of products inside the cart chosen by Id</p>
<p>POST "/:cid/product/:pid/" : Add the chosen product to chosen the cart (Object [productId:id + quantity])</p>
<p>DELETE "/:cid/product/:pid/" : Delete the chosen product from the chosen cart (Object [productId:id + quantity])</p>
<p>DELETE "/:cid" : Delete all products from the cart</p>
<p>PUT "/:cid" : Update the cart using the specific array of products format with req.body </p>
<p>PUT "/:cid/products/:pid" : Update just the quantity of the chosen product with req.body </p>


<h4>app.use("/api/products", productsRouter);</h4>
<p>GET "/" : List of products, page, limit, query, and sort</p>
<p>View of the list of products: GET "/view/" : List of products, page, limit, query, and sort</p>
<p>GET "/:pid/" : Product by ID</p>
<p>POST "/" : Add a new product</p>
<p>PUT "/:pid/" : Update a product by ID</p>
<p>DELETE "/:pid/" : Delete product by ID</p>

<h4>app.use("/api/sessions", sessionsRouter);</h4>
<p>POST "/register" : Add a new user using "req.body" by Postman.</p>
<p>POST "/login" : Log in as "user" or "admin" using "req.body" by Postman.</p>
<p>GET "/logout" : Destroy the current session and show the login view by Postman.</p>


<h3>SOCKET IO</h3>
<p>app.use(viewsRouter);</p>
<p>GET "/api/products/realTimeProducts" : Shows the list of products from JSON file (no MONGODB) and the form to add a new one to the file - The view is not working correctrly because of some problems with Socket.io</p>
<p>GET "/api/messages/" : Show the form to send a new message that will be added to the data base with MongoDB - The view is not working correctrly because of some problems with Socket.io, but you can use the form correctly to use the MongoDB.</p>


