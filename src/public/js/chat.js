const  socket = io();

const buttonChat = document.getElementById('buttonChat')
const parrafosMensaje = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')
let user

swal.fire({
    title: 'Identificacion de usuario',
    text: 'Ingrese nombre de usuario',
    input: 'text',
    inputValidator: (valor) => {
        return !valor && 'Ingrese  un nombre de usuario valido'
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value
    console.log(user);
})

buttonChat.addEventListener('click', () => {
    let fechaActaul = new Date().toLocaleString()
    if(valInput.value.trim().length > 0) {
        socket.emit('mensaje', {fecha: fechaActaul,  user: user, mensaje: valInput.value})
        valInput.value = ''
    }
})

socket.on('mensajes', (arrayMensajes) => {
    parrafosMensaje.innerHTML = ''
    arrayMensajes.forEach(mensaje => {
        parrafosMensaje.innerHTML += `<p>${mensaje.fecha} - ${mensaje.user}: ${mensaje.mensaje}</p>`
    });
})