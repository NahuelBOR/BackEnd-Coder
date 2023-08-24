import  { Router } from 'express'
import { CartManager } from '../controllers/cartManager.js'

const cartManager = new CartManager('src/models/cart.txt')

const routerProdCart = Router()

routerProdCart.get('/', async(req, res) => {
    const carts = await cartManager.getProductsFormCart()
    res.status(200).send(carts)
})
routerProdCart.get('/:cid', async(req, res) => {
    const {cid} = req.params
    const prod = await cartManager.getCartByIs(cid)

    if(prod)
        res.status(200).send(prod)
    else
        res.status(400).send('No existe')
})
routerProdCart.post('/:cid/product/:pid', async(req, res) => {
    const {cid, pid} = req.params
    const confirmacion = await cartManager.addProductToCart(cid, pid)

    if(confirmacion)
        res.status(200).send('Producto creado corectamente')
    else
        res.status(404).send('Producto ya existente')
})

export default routerProdCart