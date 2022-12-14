import { Router } from "express";
import Product from "../models/Product.js";
import ProductRepository from "../repositories/ProductRepository.js"
import uploadFileMiddleware from "../libs/multer.js";
import checkIfAdminMiddleware from "../libs/auth.js";

const router = Router();

router
    .route("/")
    // GET /api/productos
    .get(async (req, res) => {
        const products = await ProductRepository.getAll()
        // res.json(products)
        res.render("products.ejs", { products })
    })
    // POST api/productos
    .post(uploadFileMiddleware.single("foto"), checkIfAdminMiddleware, async (req, res) => {
        const { nombre, desc, codigo, precio, stock, foto } = req.body;
        const img = req.file?.originalname ? `http://localhost:8080/images/${req.file.originalname}` : `http://localhost:8080/images/${foto}`;
        const prodNew = new Product(nombre, desc, codigo, img, precio, stock);
        const prodNewId = await productDb.save(prodNew);

        const prodByID = await productDb.getById(prodNewId);
        const response = prodByID
            ? { status: "Producto agregado correctamente", code: 201, data: prodByID }
            : { status: "No se pudo agregar el producto", code: 404, data: null };

        res.status(response.code).json(response);
        // res.status(response.code).redirect("/")
    });

router
    .route("/:id")
    // GET api/productos/:id
    .get(async (req, res) => {
        const { id } = req.params;
        const prodByID = await productDb.getById(Number(id))
        const response = prodByID
            ? { status: "Ok", code: 200, data: prodByID }
            : { status: "Producto no encontrado", code: 404, data: prodByID };
        res.status(response.code).json(response);
    })
    // PUT api/productos/:id
    .put(checkIfAdminMiddleware, async (req, res) => {
        const { id } = req.params;
        const prodToUpdate = await productDb.getById(Number(id))
        if (prodToUpdate) {
            const { nombre, desc, codigo, precio, stock, foto } = req.body;
            prodToUpdate.nombre = nombre;
            prodToUpdate.desc = desc;
            prodToUpdate.codigo = codigo;
            prodToUpdate.precio = precio;
            prodToUpdate.stock = stock;
            prodToUpdate.foto = foto;
            await productDb.saveById(prodToUpdate)
            const response = prodToUpdate
                ? { status: "Producto modificado correctamente", code: 200, data: prodToUpdate }
                : { status: "No se pudo modificar el producto", code: 404, data: prodToUpdate };
            res.status(response.code).json(response);
        }
        else {
            res.status(404).json("Producto no encontrado");
        }
    })
    // DELETE api/productos/:id
    .delete(checkIfAdminMiddleware, async (req, res) => {
        const { id } = req.params;
        const prodToDelete = await productDb.deleteById(Number(id))
        const response = prodToDelete
            ? { status: "Producto eliminado correctamente", code: 200, data: prodToDelete }
            : { status: "No se pudo eliminar el producto", code: 404, data: prodToDelete };
        res.status(response.code).json(response);
    });

export default router;