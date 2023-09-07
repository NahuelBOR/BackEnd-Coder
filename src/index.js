import { log } from 'console';
import routerProd from './routes/product.routes.js';
import routerProdCart from './routes/cart.routes.js';
import express, { response } from 'express'
import multer from 'multer';
import { engine } from 'express-handlebars';
import { ProductManager } from './controllers/produsctManager.js';
import {promises as fs} from 'fs'
import { __dirname } from './path.js'
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const PORT = 4000;

const productManager = new ProductManager('src/models/productos.txt')

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})

const io = new Server(server)

//Config

const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb => callback
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

//Middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

const upload = multer({ storage: storage})
const mensajes = []

//Conexion de Socket.io
io.on('connection', (socket) => {
    console.log("conexion con Socket.io");

    /*socket.on('mensaje', info => {
        console.log(info);
        mensajes.push(info)
        socket.emit('mensajes', mensajes)
    })

    socket.on('mensaje', info => {
        console.log(info);
        socket.emit('respuesta', 'Hola desde el back, coneccion establecida')
    })

    socket.on('juego', (infoJuego) => {
        if(infoJuego == 'poker')
            console.log('conexion a Poker');
        else
            console.log('conexion a Truco');
    })

    */

    socket.on('nuevoProducto', async (prod) => {
        console.log(prod);

        //deberia agregarse al txt o json mediante addProducts
        const confirmacion = await productManager.addProduct(prod)

        if(confirmacion)
            socket.emit("mensajeProdCreado", 'El producto se creo correctamente')
        else
            socket.emit("mensajeProdCreado", 'Producto ya existente')

    })
})

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product', routerProd)
app.use('/api/cart', routerProdCart)
//Handlebars
app.get('/static', async (req,  res) => {
    /*const user = {
        nombre: 'Nahuel',
        cargo: 'tutor'
    }

    const cursos = [
        {num: 123, dia: '10/10', horario: 1800},
        {num: 124, dia: '11/11', horario: 1900},
        {num: 125, dia: '12/12', horario: 2000},
    ]

    res.render('users', {
        usuario: user,
        title: 'Home',
        isTutor: user.cargo == 'tutor',
        cursos: cursos,
        rutaCSS: 'users.css'
    })

    res.render('chat', {
        rutaCSS: 'style',
        rutaJS: 'chat'
    })
    
    res.render('realTimeProducts', {
        rutaCSS: 'realTimeProducts',
        rutaJS: 'realTimeProducts',
    })*/
    const prods = await productManager.getProducts();
    console.log(prods.length > 0);

    res.render('home', {
        rutaCSS: 'style',
        rutaJS: 'script',
        existProds: prods.length > 0,
        prods: prods
    })
})

app.get('/static/realTimeProducts', (req,  res) => {

    res.render('realTimeProducts', {
        rutaCSS: 'realTimeProducts',
        rutaJS: 'realTimeProducts',
    })

})

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    res.status(200).send("imagen Cargada")
})


app.get('/', (req, res) => {
    res.send('Hola desde la pagina de inicio de mi app')
})

app.get('/producto', async (req, res) => {
    const { categoria } = req.query
    const prod = productos.filter(prod => prod.categoria === categoria)
    console.log(req.params.id);
    if (prod){
        res.send(prod)
    }else{
        res.send('Not Found')
    }
})

app.get('/producto/:id', async (req, res) => {
    const prod = productos.find(prod => prod.id === parseInt(req.params.id))
    console.log(req.params.id);
    if (prod){
        res.send(prod)
    }else{
        res.send('Not Found')
    }
})



app.get('*', (req, res) => {
    res.send('Error 404')
})