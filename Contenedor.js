const fs = require("fs")

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName
    }

    // guardar elemento
    async save(obj) {
        try {
            let id = 1

            if (fs.existsSync(this.fileName)) {
                try {
                    const contenido = fs.readFileSync(this.fileName, "utf-8")
                    const rows = contenido.split("\r").filter(row => row).map(p => { return JSON.parse(p) })
                    id = rows[rows.length - 1].id + 1
                }
                catch (err) {
                    console.error(err)
                }
            }

            obj = { id: id, ...obj }
            fs.appendFileSync(this.fileName, JSON.stringify(obj) + "\r")
            console.log(`Guardando Producto Id: ${id}`)
        }
        catch (err) {
            console.error(err)
        }
    }

    // obtener elemento
    async getById(id) {
        try {
            await fs.promises.readFile(this.fileName, "utf-8")
                .then(data => {
                    const rows = data.split("\r").filter(row => row).map(p => JSON.parse(p)).filter(p => p.id === id)
                    console.log(rows)
                })
                .catch(err => {
                    console.error(err)
                })
        }
        catch (err) {
            console.error(err)
        }
    }

    // obtener elementos
    async getAll() {
        try {
            await fs.promises.readFile(this.fileName, "utf-8")
                .then(data => {
                    const rows = data.split("\r").filter(row => row).map(p => JSON.parse(p))
                    console.log(rows)
                })
                .catch(err => {
                    console.error(err)
                })
        }
        catch (err) {
            console.error(err)
        }
    }

    // eliminar elemento por id
    async deleteById(id) {
        try {
            await fs.promises.readFile(this.fileName, "utf-8")
                .then(data => {
                    const rows = data.split("\r").filter(row => row).map(p => JSON.parse(p))
                    rows.forEach(p => { if (p.id == id) { rows.splice(rows.indexOf(p), 1) } })
                    fs.writeFileSync(this.fileName, "");
                    rows.forEach(p => { fs.appendFileSync(this.fileName, JSON.stringify(p) + "\r"); })
                    console.log(rows)
                })
                .catch(err => {
                    console.error(err)
                })
        }
        catch (err) {
            console.error(err)
        }
    }

    // eliminar elementos
    async deleteAll() {
        try {
            await fs.promises.unlink(this.fileName)
                .then(console.log("Archivo eliminado"))
                .catch(err => console.log("No se pudo eliminar el archivo" + err))
        }
        catch (err) {
            console.error(err)
        }
    }
}

class Producto {
    constructor(title, price, thumbnail) {
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
    }
}

const contenedor = new Contenedor("./productos.txt")
const productos = [
    new Producto("Regla", 500, "./regla.jpg"),
    new Producto("Birome", 460, "./birome.jpg"),
    new Producto("Mochila", 2642, "./mochila.jpg"),
    new Producto("Libro", 1030, "./libro.jpg")
]

contenedor.deleteAll()
productos.forEach(p => contenedor.save(p))
contenedor.getAll()
contenedor.deleteById(3)
contenedor.getById(2)