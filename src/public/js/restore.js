const form = document.getElementById("restoreForm");
const responseSuccess = document.getElementById("restoreSuccess");
const successMsg = document.createElement('p');

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  console.log(data);
  data.forEach((value, key) => (obj[key] = value));

  fetch("https://entregas-backend-luduena-production.up.railway.app/api/sessions/restore", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status === 200) {
      console.log('Successful password restore.');
      //Try sweet alert.
      successMsg.innerHTML = `<p>Contraseña actualizada con éxito.</p>`;
      responseSuccess.appendChild(successMsg)
    } else {
      console.log("Something went wrong. Try again.");
      successMsg.innerHTML = `<p>Error al actualizar la contraseña. Intente con una contraseña diferente.</p>`;
      responseSuccess.appendChild(successMsg)
    }
  });
});
