const socket = io();

//Conection client-server
socket.emit("conectionMessage", "Cliente conectado!")
console.log("Cliente conectdo! (client side)")


//View
async function renderProductList(products) {

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
        renderProductList(products);
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
    }
};
