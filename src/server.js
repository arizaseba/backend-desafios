import Contenedor from "./contenedor.js"
import express, { json, urlencoded } from "express";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

const contenedor = new Contenedor("./db/productos.txt")

app.get("/api/productos", async (req, res) => {
    let datos = await contenedor.getAll()
    res.json(datos)
});

app.get("/api/productoRandom", async (req, res) => {
    let datos = await contenedor.getAll()
    var item = datos[Math.floor(Math.random() * datos.length)];
    res.json(item)
});

app.listen(3000, () => {
    console.log("Server listening http://localhost:3000");
});