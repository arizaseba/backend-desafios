export default class Product {
    constructor
        (
            nombre = new String(),
            desc = new String(),
            codigo = new String(),
            foto = new String(),
            precio = new Number(),
            stock = new Number()
        ) {
        this.timestamp = Date.now()
        this.nombre = nombre
        this.desc = desc
        this.codigo = codigo
        this.foto = foto
        this.precio = precio
        this.stock = stock
    }
}