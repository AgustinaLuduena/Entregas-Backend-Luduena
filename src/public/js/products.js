//SEE PROFILE BUTTON  

const profileBtn = document.getElementById("profile-btn");

profileBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const token = localStorage.getItem("proyecto_backend"); // Asumiendo que el token se almacena en localStorage

    fetch('/products', 
      { method: 'GET', 
        headers: {'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
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
