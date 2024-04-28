//REGISTER LOGIC

const form = document.getElementById("registerForm");
const registerMsg = document.getElementById("registerMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  
//   fetch("/api/sessions/register", {
//     method: "POST",
//     body: JSON.stringify(obj),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((json) => {
//       console.log(json);
//     });

//     form.reset();
// });

fetch("/api/sessions/register", {
  method: "POST",
  body: JSON.stringify(obj),
  headers: {
    "Content-Type": "application/json",
  },
})
.then(response => {
  if (!response.ok) {
    document.getElementById('mensaje').innerText = 'El usuario ya existe en la base de datos.';
    throw new Error('Failed to register');
  } else {
    document.getElementById('mensaje').innerText = 'Usuario exitosamente registrado.';
    form.reset();
  }
  return response.json();
})
.catch(error => {
  console.error(error);
})
})
