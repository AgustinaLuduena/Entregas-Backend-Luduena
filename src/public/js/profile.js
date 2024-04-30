//LOG OUT BUTTON

const logoutBtn = document.getElementById("logout-btn");
const homeBtn = document.getElementById("home-btn");

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

