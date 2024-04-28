//LOGIN LOGIC

const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
  
//   .then((response) => {
//     if (response.status === 200) {
//       window.location.replace("/products"); 
//     }
//   });
// });

.then(response => {
  if (!response.ok) {
    document.getElementById('loginMsg').innerText = 'Error en las credenciales. Intente nuevamente.';
    throw new Error('Failed to login');
  } 
  
  window.location.replace("/products"); 
})
.catch(error => {
  console.error(error);
})
})