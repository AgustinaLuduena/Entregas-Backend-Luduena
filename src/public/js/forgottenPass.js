document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mailForm');
    const mailSuccess = document.getElementById('mailSuccess');
    const successMsg = document.createElement('p');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.email.value;

        try {
            const response = await fetch('https://entregas-backend-luduena-production.up.railway.app/api/sessions/restoreReq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const error = await response.json();
                mailSuccess.textContent = error.error || 'Ocurrió un error al enviar la solicitud.';
            } else {
                const result = await response.json();
                successMsg.innerHTML = `<p>El mail fue enviado con éxito. Revise su casilla de correo y presione el link enviado para restaurar la contraseña.</p>`;
                mailSuccess.appendChild(successMsg)
            }

        } catch (error) {
            mailSuccess.textContent = 'Ocurrió un error al enviar la solicitud. Por favor, inténtelo de nuevo.';
            console.log('Error al enviar la solicitud:', error);
        }
    });
});
