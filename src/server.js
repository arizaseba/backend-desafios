import Contenedor from "./contenedor.js"
import express, { json, urlencoded } from "express";
import Producto from "./Producto.js";

const app = express();
const contenedor = new Contenedor("./db/productos.txt")

app.use(json());
app.use(urlencoded({ extended: true }));

// GET [api/productos]
app.get("/api/productos", async (req, res) => {
    const products = await contenedor.getAll()
    res.json(products)
});

// GET [api/productos/:id]
app.get("/api/productos/:id", async (req, res) => {
    const { id } = req.params;
    const prodByID = await contenedor.getById(Number(id))

    const response = prodByID
        ? { status: "Ok", code: 200, data: prodByID }
        : { status: "Producto no encontrado", code: 404, data: null };
    res.status(response.code).send(response);
});

// POST [api/productos]
app.post("/api/productos/", async (req, res) => {
    const { title, price, thumbnail } = req.body;
    const prodNew = new Producto(title, price, thumbnail);
    const prodNewId = await contenedor.save(prodNew);

    const prodByID = await contenedor.getById(prodNewId);
    const response = prodByID
        ? { status: "Producto agregado correctamente", code: 200, data: prodByID }
        : { status: "No se pudo agregar el producto", code: 404, data: null };
    res.status(response.code).send(response);
});

// PUT [api/productos/:id]
app.put("/api/productos/:id", async (req, res) => {
    const { id } = req.params;
    const prodByID = await contenedor.getById(Number(id))
    if (prodByID) {
        const { title, price, thumbnail } = req.body;
        prodByID.title = title
        prodByID.price = price
        prodByID.thumbnail = thumbnail
        await contenedor.saveById(prodByID)
        const response = prodByID
            ? { status: "Producto modificado correctamente", code: 200, data: prodByID }
            : { status: "No se pudo modificar el producto", code: 404, data: null };
        res.status(response.code).send(response);
    }
    else {
        res.status(404).send("Producto no encontrado");
    }
});

// DELETE [api/productos/:id]
app.delete("/api/productos/:id", async (req, res) => {
    const { id } = req.params;
    const prodByID = await contenedor.deleteById(Number(id))
    const response = prodByID
        ? { status: "Producto eliminado correctamente", code: 200, data: prodByID }
        : { status: "No se pudo eliminar el producto", code: 404, data: null };
    res.status(response.code).send(response);
});


// USE
app.use(function (req, res, next) {
    const response = {
        error: true,
        codigo: 404,
        mensaje: 'URL no encontrada'
    };
    res.status(response.codigo).json(response);
});

// LISTEN
app.listen(8080, () => {
    console.log("Server listening http://localhost:8080");
});