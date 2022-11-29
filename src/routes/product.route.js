import { Router } from "express";
import Producto from "../model/Producto.js";
import productDb from "../repository/ProductoRepository.js"
import uploadFileMiddleware from "../libs/multer.js";

const router = Router();

router
    .route("/")
    // GET /api/productos
    .get(async (req, res) => {
        const products = await productDb.getAll()
        res.json(products)
    })
    // POST api/productos
    .post(uploadFileMiddleware.single("productImage"), async (req, res) => {
        const { title, price } = req.body;
        const image = req.file;
        const prodNew = new Producto(title, price, `http://localhost:8080/images/${image.originalname}`);
        const prodNewId = await productDb.save(prodNew);

        const prodByID = await productDb.getById(prodNewId);
        const response = prodByID
            ? { status: "Producto agregado correctamente", code: 201, data: prodByID }
            : { status: "No se pudo agregar el producto", code: 404, data: null };
        res.status(response.code).send(response);
    });

router
    .route("/:id")
    // GET api/productos/:id
    .get(async (req, res) => {
        const { id } = req.params;
        const prodByID = await productDb.getById(Number(id))

        const response = prodByID
            ? { status: "Ok", code: 200, data: prodByID }
            : { status: "Producto no encontrado", code: 404, data: null };
        res.status(response.code).send(response);
    })
    // PUT api/productos/:id
    .put(async (req, res) => {
        const { id } = req.params;
        const prodByID = await productDb.getById(Number(id))
        if (prodByID) {
            const { title, price, thumbnail } = req.body;
            prodByID.title = title
            prodByID.price = price
            prodByID.thumbnail = thumbnail
            await productDb.saveById(prodByID)
            const response = prodByID
                ? { status: "Producto modificado correctamente", code: 200, data: prodByID }
                : { status: "No se pudo modificar el producto", code: 404, data: null };
            res.status(response.code).send(response);
        }
        else {
            res.status(404).send("Producto no encontrado");
        }
    })
    // DELETE api/productos/:id
    .delete(async (req, res) => {
        const { id } = req.params;
        const prodByID = await productDb.deleteById(Number(id))
        const response = prodByID
            ? { status: "Producto eliminado correctamente", code: 200, data: prodByID }
            : { status: "No se pudo eliminar el producto", code: 404, data: null };
        res.status(response.code).send(response);
    });

export default router;