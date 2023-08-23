import { log } from 'console';
import routerProd from './routes/product.routes.js';
import express, { response } from 'express'
import multer from 'multer';
import {promises as fs} from 'fs'
import { __dirname } from './path.js'

const app = express();
const PORT = 4000;

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
const upload = multer({ storage: storage})

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product', routerProd)
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
    const prod = productos.find(prod => prod.id === parseInt (req.params.id))
    console.log(req.params.id);
    if (prod){
        res.send(prod)
    }else{
        res.send('Not Found')
    }
})

//Server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})

app.get('*', (req, res) => {
    res.send('Error 404')
})