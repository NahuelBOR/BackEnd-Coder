const socket = io()

socket.emit('mensaje', 'Hola  servidor')

socket.on('respuesta', (info) => {
    if(info) {
        socket.emit('juego', 'truco')
    }else{
        console.log('error en conexion');
    }
})