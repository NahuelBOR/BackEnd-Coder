

const socket = io();

const form = document.getElementById('fromProduct');

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const datForm = new FormData(e.target)
    const prod = Object.fromEntries(datForm) 
    socket.emit('nuevoProducto', prod)

    socket.on('mensajeProdCreado', (mensaje) => {
    Swal.fire(
        mensaje
      )
    })

    e.target.reset()
})

