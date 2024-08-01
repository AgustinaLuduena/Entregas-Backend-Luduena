const token = localStorage.getItem("proyecto_backend");

//PROFILE BUTTON  
const profileBtn = document.getElementById("profile-btn");
profileBtn.addEventListener('click', (e) => {
    e.preventDefault();

    fetch('/products', 
      { method: 'GET', 
        headers: {'Authorization': `Bearer ${token}`
        } 
      })
    .then((response) => {
        if (response.status === 200) {
          window.location.replace("/profile"); 
        } else {
          response.status === 401
          response.statusText('No autorizado. Por favor, inicie sesión nuevamente.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      }); ;
});

//ADD TO CART BUTTON 
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();

        const productId = button.getAttribute('data-product-id');
        const cartId = document.getElementById("cart-id").value;

        fetch(`/api/carts/${cartId}/product/${productId}`, 
        { method: 'POST',
          headers: {'Authorization': `Bearer ${token}`
          }
        })
        .then((response) => {
            if (response.status === 200) {
                window.location.replace("/products"); 
            } else {
              response.statusText('Usuario no autorizado. Por favor, inicie sesión nuevamente.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
