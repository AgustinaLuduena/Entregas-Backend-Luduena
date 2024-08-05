const profileBtn = document.getElementById("profile-btn");
profileBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace("https://entregas-backend-luduena-production.up.railway.app/profile"); 
});