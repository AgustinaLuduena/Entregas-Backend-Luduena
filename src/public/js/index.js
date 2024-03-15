const socket = io();

//Conection client-server
socket.emit("message", "Cliente conectado!")
console.log("Cliente conectdo! (client side)")

//View
const form = document.getElementById("products");
const newList = document.getElementById('newList');

function renderProductList(products) {

    newList.innerHTML = ""; 

    if (!Array.isArray(products)) {
        console.error('La lista de productos no es un array:', products);
        return;
    }

    products.forEach(product => {
        const productHtml = `
            <div>
                <h4>Producto:</h4>
                <p>ID: ${product.id}</p>
                <p>Título: ${product.title}</p>
                <p>Descripción: ${product.description}</p>
                <p>Código: ${product.code}</p>
                <p>Precio: ${product.price}</p
                <p>Status: ${product.status}</p>
                <p>Stock: ${product.stock}</p>
                <p>Categoría: ${product.category}</p>
                <p>Imagen: ${product.thumbnail}</p>
            </div>
        `;

        newList.innerHTML += productHtml;
    });
}

//List of products

socket.on("getProd", (products) => {
    renderProductList(products);
});
 
window.onload = async function() {
    try {
        //const response = await fetch('/api/products');
        //const products = await response.json();
        renderProductList(products);
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
    }
};


//Form
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const InputTitle = document.getElementById('InputTitle').value;
    const InputDescription = document.getElementById('InputDescription').value;
    const InputCode = document.getElementById('InputCode').value;
    const InputPrice = document.getElementById('InputPrice').value;
    const InputStock = document.getElementById('InputStock').value;
    const InputCategory = document.getElementById('InputCategory').value;

    if (!InputTitle || !InputDescription || !InputCode || !InputPrice || !InputStock || !InputCategory) {
        const errorManager = document.getElementById('error');
        errorManager.innerHTML = `Por favor, complete todos los campos.`;
        console.log("Por favor, complete todos los campos.");
        return;
    }

    socket.emit('info', {
        title: InputTitle,
        description: InputDescription,
        code: InputCode,
        price: InputPrice,
        stock: InputStock,
        category: InputCategory
    });

    form.reset();
});

socket.on("info", (productData) => {

    const newDataHtml = `
        <li>
            <h4>Nuevo producto:</h4>
            <p>Título: ${productData.title}</p>
            <p>Descripción: ${productData.description}</p>
            <p>Código: ${productData.code}</p>
            <p>Precio: ${productData.price}</p>
            <p>Stock: ${productData.stock}</p>
            <p>Categoría: ${productData.category}</p>
        </li>
    `;

    newList.innerHTML += newDataHtml;
});
