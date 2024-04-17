
const form = document.getElementById("restoreForm");
const responseSuccess = document.getElementById("restoreSuccess");
const successMsg = document.createElement('p');

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  console.log(data);
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/sessions/restore", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status === 200) {
      console.log('Successful password restore.');
      //Podría ser un sweet alert.
      successMsg.innerHTML = `<p>Contraseña actualizada con éxito. <a href="/login">Volver al inicio.</a></p>`;
      responseSuccess.appendChild(successMsg)
    } else {
      console.log("Something went wrong. Try again.");
    }
  });
});
