<h1 align="center">Práctica de Integración - Programación Backend</h1>
<h2 align="center">Agustina Ludueña</h2>
<p align="center">Cursada 2024</p>

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> </p>

<h3 align="left">Routes of the project:</h3>

<h4>SOCKET IO</h4>
<p>app.use(viewsRouter);</p>
<p>GET "/realTimeProducts" : Shows the list of products from JSON file (no MONGODB) and the form to add a new one to the file</p>

<h4>MONGO DB</h4>

<p>app.use(viewsRouter);</p>
<p>GET "/api/messages/" : Show the form to send a new message that will be added to the data base with MongoDB.</p>

<p>app.use("/api/carts", cartsRouter);</p>
<p>POST "/" : Add a new cart (Cart Id + products:[])</p>
<p>GET "/:cid/" : List of products inside the cart chosen by Id</p>
<p>POST "/:cid/product/:pid/" : Add the chosen product to chosen the cart (Object [productId:id + quantity])</p>
<p>DELETE "/:cid/product/:pid/" : Delete the chosen product from the chosen cart (Object [productId:id + quantity])</p>


<p>app.use("/api/products", productsRouter);</p>
<p>GET "/" : List of products & limit</p>
<p>GET "/:pid/" : Product by ID</p>
<p>POST "/" : Add a new product</p>
<p>PUT "/:pid/" : Update a product by ID</p>
<p>DELETE "/:pid/" : Delete product by ID</p>




