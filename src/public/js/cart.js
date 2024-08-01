//Profile buttons
const shopBtn = document.getElementById("shop-btn");
const profileBtn = document.getElementById("profile-btn");
const homeBtn = document.getElementById("home-btn");

shopBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const cartId = document.getElementById("cart-id").value;
  
  if (cartId) {
    try {
      window.location.replace(`/carts/${cartId}/purchase`);
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    console.log("Error. An error has ocurred. Try finish your shop later.");
  }
});


profileBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const token = localStorage.getItem("proyecto_backend");

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

homeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace("/products"); 
});

