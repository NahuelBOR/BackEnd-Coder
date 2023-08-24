import  { Router } from 'express'
import { ProductManager } from '../controllers/produsctManager.js'

const productManager = new ProductManager('src/models/productos.txt')

const routerProd = Router()

routerProd.get('/', async(req, res) => {
    const {limit} = req.query

    const prods = await productManager.getProducts()
    const productos = prods.slice(0, limit)
    res.status(200).send(productos)
})
routerProd.get('/:id', async(req, res) => {
    const {id} = req.params
    const prod = await productManager.getProductByIs(id)

    if(prod)
        res.status(200).send(prod)
    else
        res.status(400).send('No existe')
})
routerProd.post('/', async(req, res) => {
    const confirmacion = await productManager.addProduct(req.body)

    if(confirmacion)
        res.status(200).send('Producto creado corectamente')
    else
        res.status(404).send('Producto ya existente')
})
routerProd.put('/:id', async(req, res) => {
    const confirmacion = await productManager.updateProduct(req.params.id, req.body)

    if(confirmacion)
        res.status(200).send('Producto actualizado corectamente')
    else
        res.status(404).send('Producto no encontrado')
})
routerProd.delete('/:id', async(req, res) => {
    const confirmacion = await productManager.deleteProduct(req.params.id)

    if(confirmacion)
        res.status(200).send('Producto eliminado corectamente')
    else
        res.status(404).send('Producto no encontrado')
})

export default routerProd