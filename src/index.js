import { log } from 'console';
import express from 'express'
import {promises as fs} from 'fs'

const productos = [
    {
        nombre: 'Coca Cola',
        id: 1, 
        categoria: "gaseosa"
    },
    {
        nombre: 'Pepsi',
        id: 2,
        categoria: "gaseosa"
    },
    {
        nombre: 'Gallo Oro',
        id: 3,
        categoria: "arroz"
    },
]

const app = express();
const PORT = 4000;
const PATH = './src/users.json'

class User {
    constructor(nombre, apellido, email, password) {
        this.nombre  =  nombre;
        this.apellido  =  apellido;
        this.email  =  email;
        this.password  =  password;
        this.id = User.incrementarId();
    }

    static incrementarId(){
        if(this.idIncrement){
            this.idIncrement = this.idIncrement + 1;
        }else{
            this.idIncrement = 1;
        }

        return this.idIncrement
    }
}

app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hola desde la pagina de inicio de mi app')
})

app.post('/users', async (req, res) => {
    const {nombre, apellido, email, password } = req.body
    console.log(req.body);

    const users = JSON.parse(await fs.readFile(PATH, 'utf-8'))
    const user = users.find(usuario => usuario.email === email)

    if(user){
        res.status(400).send('Usuario ya existe')
    }else{
        const userClass = new User(nombre, apellido, email, password)
        users.push(userClass)
        await fs.writeFile(PATH, JSON.stringify(users))

        res.status(200).send(`Usuario ${nombre} Creado`)
    }
})

app.put('/users/:id', async (req, res) => {
    const { id } = req.params
    const { nombre, apellido, email, password } = req.body
    console.log(req.body);

    const users = JSON.parse(await fs.readFile(PATH, 'utf-8'))
    const userIndex = users.findIndex(usuario => usuario.id === parseInt(id))

    if(userIndex != -1){
        users[userIndex].nombre = nombre
        users[userIndex].apellido = apellido
        users[userIndex].email = email
        users[userIndex].password = password
        await fs.writeFile(PATH, JSON.stringify(users))

        res.status(200).send(`Usuario ${nombre} Actualizado`)
    }else{
        res.status(400).send('Usuario no existe')
    }
})

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params

    const users = JSON.parse(await fs.readFile(PATH, 'utf-8'))
    const userIndex = users.findIndex(usuario => usuario.id === parseInt(id))

    if(userIndex != -1){
        await fs.writeFile(PATH, JSON.stringify(users.filter(user => user.id != parseInt(id))))
        res.status(200).send(`Usuario Eliminado`)
    }else{
        res.status(400).send('Usuario no existe')
    }
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

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})

app.get('*', (req, res) => {
    res.send('Error 404')
})