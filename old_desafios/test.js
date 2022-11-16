import Contenedor from "../src/contenedor.js"
import Producto from "../src/Producto.js"

async function main() {
    const contenedor = new Contenedor("./db/productos.txt")
    const productos = [
        new Producto("Regla", 500, "./regla.jpg"),
        new Producto("Birome", 460, "./birome.jpg"),
        new Producto("Mochila", 2642, "./mochila.jpg"),
        new Producto("Libro", 1030, "./libro.jpg")
    ]

    let datos;

    datos = await contenedor.deleteAll()

    datos = await contenedor.getAll()
    console.log(datos);

    for (const p of productos) {
        datos = await contenedor.save(p)
        console.log(datos);
    }

    // datos = await contenedor.deleteById(3)
    // console.log(datos);

    // datos = await contenedor.getById(2)
    // console.log(datos);
}

main()