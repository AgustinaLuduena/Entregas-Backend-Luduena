document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById("profile-btn");
  profileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.replace("https://entregas-backend-luduena-production.up.railway.app/profile"); 
  });

  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const userId = btn.getAttribute('data-id');

      if(userId) {
        try {
          fetch(`https://entregas-backend-luduena-production.up.railway.app/admin/users/${userId}`, { method: 'DELETE' })
          .then((response) => {
            if (response.status === 200) {
              window.location.replace("https://entregas-backend-luduena-production.up.railway.app/admin/users"); 
            }
          });
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        console.log("Error. An error has ocurred.");
      }
    });
  });
});


