export default class Carrito {
    constructor(productos = []) {
        this.timestamp = Date.now()
        this.productos = productos
    }
}