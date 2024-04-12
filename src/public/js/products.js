//SEE PROFILE BUTTON  

const logoutBtn = document.getElementById("profile-btn");

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    fetch('/products', { method: 'GET' })
    .then((response) => {
        if (response.status === 200) {
          window.location.replace("/profile"); 
        }
      });
});

