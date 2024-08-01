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
  console.log(response)
  return response.json(); // Obtener el cuerpo de la respuesta en formato JSON
})
.then(data => {
  localStorage.setItem("proyecto_backend", data.token); // Guardar el token en localStorage
  console.log(data)
  console.log(data.token)
  //res.cookie("proyecto_backend", data.token)
  //window.location.replace("https://entregas-backend-luduena-production.up.railway.app/products");
})
.catch(error => {
  console.error(error);
})
})

//           .then(data => {
//               // Extraer el token de la respuesta JSON
//               // Almacenar el token en el almacenamiento local
//               const token = data.access_token;
//               const userId = data.userId;
//               const userRole = data.userRole;

//               localStorage.setItem('token', token);
//               localStorage.setItem('userId', userId);
//               localStorage.setItem('userRole', userRole);
//               console.log("Token:", token);
//               console.log("userId:", userId);
//               console.log("user rol:", userRole);
//               console.log("Inicio de sesión exitoso!");

//               if (userRole === 'admin') {
//                   window.location.href = `https://backend-final-production-8834.up.railway.app/api/sessions/dashboard/${userId}`;
//               }
//               else {
//                   window.location.href = "https://backend-final-production-8834.up.railway.app/api/products";
//               }
//           })
//           .catch(error => {
//               console.error('Error en el inicio de sesión:', error);
//           });
//       });
//   }
// });