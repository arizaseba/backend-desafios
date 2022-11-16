class Usuario {
    constructor(nombre = "", apellido = "", libros = [], mascotas = []) {
        this.nombre = nombre
        this.apellido = apellido
        this.libros = libros
        this.mascotas = mascotas
    }
    getFullName() {
        return `${this.nombre} ${this.apellido}`
    }
    addMascota(nombre) {
        this.mascotas.push(nombre)
    }
    countMascotas() {
        return this.mascotas.length
    }
    addBook(nombre, autor) {
        this.libros.push({ nombre: nombre, autor: autor })
    }
    getBookNames() {
        return this.libros.map(x => x.nombre)
    }
}

const user = new Usuario("Sebastian", "Ariza")
user.addMascota("Tommy")
user.addBook("El principito", "Antoine de Saint-Exupéry")
user.addBook("Harry Potter y la piedra filosofal", "J. K. Rowling")

console.log(user)
console.log(user.getFullName())
console.log(user.countMascotas())
console.log(user.getBookNames())