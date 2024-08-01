//Profile buttons
const cartBtn = document.getElementById("cart-btn");
const logoutBtn = document.getElementById("logout-btn");
const homeBtn = document.getElementById("home-btn");

cartBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const cartId = document.getElementById("cart-id").value;
  
  if (cartId) {
    try {
      window.location.replace(`/carts/${cartId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    console.log("Error. Cart was not found.");
  }
});


logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();

  fetch('/api/sessions/logout', { method: 'POST' })
  .then((response) => {
      if (response.status === 200) {
        window.location.replace("/"); 
      }
    });
});

homeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace("/products"); 
});

