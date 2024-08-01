//Cart buttons
document.addEventListener('DOMContentLoaded', () => {
  const cartId = document.getElementById("cart-id").value;
  const token = localStorage.getItem("proyecto_backend");

const shopBtn = document.getElementById("shop-btn");
shopBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  
  if (cartId) {
    try {
      window.location.replace(`https://entregas-backend-luduena-production.up.railway.app/carts/${cartId}/purchase`);
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    console.log("Error. An error has ocurred. Try finish your shop later.");
  }
});

const profileBtn = document.getElementById("profile-btn");
profileBtn.addEventListener('click', (e) => {
  e.preventDefault();

  fetch('https://entregas-backend-luduena-production.up.railway.app/products', 
    { method: 'GET', 
      headers: { 'Authorization': `Bearer ${token}` } 
    })
  .then((response) => {
    if (response.status === 200) {
      window.location.replace("https://entregas-backend-luduena-production.up.railway.app/profile"); 
    } else if (response.status === 401) {
      console.log('No autorizado. Por favor, inicie sesión nuevamente.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

const homeBtn = document.getElementById("home-btn");
homeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace("https://entregas-backend-luduena-production.up.railway.app/products"); 
});

const removeButtons = document.querySelectorAll('.remove-btn');
removeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-product-id');
        fetch(`https://entregas-backend-luduena-production.up.railway.app/carts/${cartId}/product/${productId}`, 
        { method: 'DELETE', 
          headers: {'Authorization': `Bearer ${token}`
          } 
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    event.target.closest('.cart-item').remove();
                } else {
                    console.log('Error al eliminar el producto.');
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
});
