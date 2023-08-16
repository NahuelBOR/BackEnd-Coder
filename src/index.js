import express from 'express'

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

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})

app.get('*', (req, res) => {
    res.send('Error 404')
})