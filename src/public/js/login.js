//LOGIN LOGIC
const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  
  fetch("https://entregas-backend-luduena-production.up.railway.app/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })

.then(response => {
  if (!response.ok) {
    document.getElementById('loginMsg').innerText = 'Error en las credenciales. Intente nuevamente.';
    throw new Error('Failed to login');
  } 

  return response.json();
})
.then(data => {
  localStorage.setItem("proyecto_backend", data.token);
  window.location.replace("https://entregas-backend-luduena-production.up.railway.app/products");
})
.catch(error => {
  console.error(error);
})
})