import { Router } from "express";
import checkIfAdminMiddleware from "../libs/auth.js";
import Carrito from "../models/Carrito.js";
import carritoDb from "../repositories/CarritoRepository.js"
import productDb from "../repositories/ProductoRepository.js"

const router = Router();

router
    .route("/")
    // GET /api/carrito
    .get(async (req, res) => {
        const carrito = await carritoDb.getAll()
        res.json(carrito)
    })
    // POST api/carrito
    .post(checkIfAdminMiddleware, async (req, res) => {
        const carritoNewId = await carritoDb.save(new Carrito());
        res.json(carritoNewId)
    });

router
    .route("/:id")
    // DELETE api/carrito/:id
    .delete(checkIfAdminMiddleware, async (req, res) => {
        const { id } = req.params;
        const carritoToDelete = await carritoDb.deleteById(Number(id))
        const response = carritoToDelete
            ? { status: "Producto eliminado correctamente", code: 200, data: carritoToDelete }
            : { status: "No se pudo eliminar el producto", code: 404, data: carritoToDelete };
        res.status(response.code).json(response);
    });

router
    .route("/:id/productos")
    // GET api/carrito/:id/productos
    .get(async (req, res) => {
        const { id } = req.params;
        const carrito = await carritoDb.getById(Number(id));
        res.json(carrito.productos)
    });

router
    .route("/:id/productos/:id_prod")
    // POST api/carrito/:id/productos/:id_prod
    .post(checkIfAdminMiddleware, async (req, res) => {
        const { id, id_prod } = req.params;
        // busco el carrito a actualizar
        const carritoToUpdate = await carritoDb.getById(Number(id));
        // busco el producto a agregar
        const prodByID = await productDb.getById(Number(id_prod));
        // agrego el producto al objeto
        let cantidad = 1
        const item = carritoToUpdate.productos.find(item => item.id === prodByID.id)
        if (!item) {
            const newItem = { ...prodByID, cantidad }
            carritoToUpdate.productos.push(newItem)
        }
        else {
            item.cantidad++
        }
        
        // agrego el producto a la db
        const carrito = await carritoDb.saveById(carritoToUpdate)
        res.json(carrito)
    })
    // DELETE api/carrito/:id/productos/:id_prod
    .delete(checkIfAdminMiddleware, async (req, res) => {
        const { id, id_prod } = req.params;
        // busco el carrito a actualizar
        const carritoToUpdate = await carritoDb.getById(Number(id));
        // elimino el producto del carrito
        carritoToUpdate.productos = carritoToUpdate.productos.filter(item => item.id !== Number(id_prod))
        // agrego el producto a la db
        const carrito = await carritoDb.saveById(carritoToUpdate)
        res.json(carrito)
    });

export default router;