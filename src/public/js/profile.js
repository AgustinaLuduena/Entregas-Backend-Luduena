//Profile buttons
const logoutBtn = document.getElementById("logout-btn");
const homeBtn = document.getElementById("home-btn");

logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();

  fetch('https://entregas-backend-luduena-production.up.railway.app/api/sessions/logout', { method: 'GET' })
  .then((response) => {
      if (response.status === 200) {
        window.location.replace("https://entregas-backend-luduena-production.up.railway.app/"); 
      }
    });
});

homeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace("https://entregas-backend-luduena-production.up.railway.app/products"); 
});

//Admin Buttons
const adminBtn = document.getElementById("admin-btn");
if (adminBtn) {
  adminBtn.addEventListener('click', () => {
    window.location.replace("https://entregas-backend-luduena-production.up.railway.app/admin/users");
  });
}

//Cart
const cartBtn = document.getElementById("cart-btn");
if(cartBtn) {
  cartBtn.addEventListener('click', async (e) => {
    e.preventDefault();
  
    const cartId = document.getElementById("cart-id").value;
    
    if (cartId) {
      try {
        window.location.replace(`https://entregas-backend-luduena-production.up.railway.app/carts/${cartId}`);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log("Error. Cart was not found.");
    }
  });  
}
