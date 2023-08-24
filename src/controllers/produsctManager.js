import { log } from "console"
import { promises as fs } from "fs"

export class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path
    }

    static incrementarID()  {
        if(this.idIncrement) {
            this.idIncrement++
        }else{
            this.idIncrement = 1
        }
        return this.idIncrement
    }

    async  getProducts() {
        const prods =  JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return prods
    }

    async  addProduct(prod) {
        const  prods =  JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const existProd = prods.find(producto => producto.code === prod.code)

        if(existProd){
            return false
        }else{
            prod.id = ProductManager.incrementarID()
            prods.push(prod)
            await fs.writeFile(this.path, JSON.stringify(prods))
            return true
        }
    }

    async updateProduct(id, prod) {
        const  prods =  JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const existProd = prods.find(producto => producto.id === id)

        if(existProd){
            return false
        }else{
            prod.id = prods[id-1].id
            prods[id-1] = prod
            await fs.writeFile(this.path, JSON.stringify(prods))
            return true
        }
    }

    async deleteProduct(id) {
        const  prods =  JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const existProd = prods.find(prod => prod.id === parseInt(id))
        console.log(prods);
        console.log(existProd);

        if(existProd){
            return false
        }else{
            prods.splice(id-1, 1)
            await fs.writeFile(this.path, JSON.stringify(prods))
            return true
        }
    }
}