import { log } from "console"
import { promises as fs } from "fs"

export class CartManager {
    constructor(path) {
        this.carts = []
        this.path = path
    }

    static incrementar()  {
        if(this.increment) {
            this.increment++
        }else{
            this.increment = 1
        }
        return this.increment
    }

    async  getProductsFormCart() {
        const prods =  JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return prods
    }

    async  getCartByIs(cid) {
        const carts =  JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return carts[cid-1]
    }

    async  addProductToCart(cid, pid) {
        const  carts =  JSON.parse(await fs.readFile(this.path, 'utf-8'))

        if(carts[cid-1]){
            carts[cid-1].products = pid
            carts[cid-1].quantity = CartManager.incrementar()
            
            await fs.writeFile(this.path, JSON.stringify(carts))
            return true
        }else{
            return false
        }
    }
}