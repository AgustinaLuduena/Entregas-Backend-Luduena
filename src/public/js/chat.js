const socket = io();

socket.on('addedMessage', (addMessage) => {
    const chatList = document.getElementById('chatList');
    const chatElement = document.createElement('div');
    chatElement.classList.add('col-md-4', 'mb-4');
    chatElement.innerHTML = `
        <div class="card">
            <h2>User: ${addMessage.user}</h2>
            <p>Message: ${addMessage.text}</p>
        </div>`;
    chatList.appendChild(chatElement);
});

document.getElementById('messageForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;

    if (user && message) {
        try {
            const response = await fetch('http://localhost:8080/api/messages/addMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, text: message })
            });

            if (!response.ok) {
                throw new Error('Error al agregar el mensaje');
            }

            console.log("Mensaje agregado:", { user, message });
            socket.emit("addMessage", { user, text: message });
            document.getElementById('message').value = '';

            event.target.reset();
        } catch (error) {
            console.error('Error al agregar el mensaje:', error);
        }
    }
});


/* 
//Chat before MongoDB
let user;

window.onload = () => {
    Swal.fire({
        title: 'Indentificate',
        text: 'Igrese su nombre de usuario',
        input: "text",
        inputValidator: (value) => {
            return !value && "Necesitas escribir un nombre para continuar"
        },
        confirmButtonText: 'OK'
      }).then((result) => {
        console.log("🚀 ~ result:", result)
        user = result.value
        socket.emit('auth', user)
      })
}

const chatbox = document.getElementById("chatbox")
const log = document.getElementById("log")

chatbox.addEventListener('keyup', e =>{
    if(e.key === "Enter"){
        //console.log(chatbox.value)
        socket.emit('message',{user: user, message:chatbox.value})
    }
})

socket.on('messageLogs', data => {
    
    let messages = ""

    data.forEach(msg => {
        messages+= `${msg.user} dice: ${msg.message}<br/>`
    });

    log.innerHTML=messages

})
*/