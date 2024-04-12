//LOG OUT BUTTON

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    fetch('/api/sessions/logout', { method: 'POST' })
    .then((response) => {
        if (response.status === 200) {
          window.location.replace("/"); 
        }
      });
});

