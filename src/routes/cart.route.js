import { Router } from "express";
import checkIfAdminMiddleware from "../libs/auth.js";
import Cart from "../models/Cart.js";
import carritoDb from "../repositories/CartRepository.js"
import productDb from "../repositories/ProductRepository.js"

const router = Router();

router
    .route("/")
    // GET /api/carrito
    .get(async (req, res) => {
        const cart = await carritoDb.getAll()
        res.json(cart)
    })
    // POST api/carrito
    .post(checkIfAdminMiddleware, async (req, res) => {
        const newCart = await carritoDb.save(new Cart());
        res.json(newCart)
    });

router
    .route("/:id")
    // DELETE api/carrito/:id
    .delete(checkIfAdminMiddleware, async (req, res) => {
        const { id } = req.params;
        const cartToDelete = await carritoDb.deleteById(Number(id))
        const response = cartToDelete
            ? { status: "Producto eliminado correctamente", code: 200, data: cartToDelete }
            : { status: "No se pudo eliminar el producto", code: 404, data: cartToDelete };
        res.status(response.code).json(response);
    });

router
    .route("/:id/productos")
    // GET api/carrito/:id/productos
    .get(async (req, res) => {
        const { id } = req.params;
        const cart = await carritoDb.getById(Number(id));
        res.json(cart.productos)
    });

router
    .route("/:id/productos/:id_prod")
    // POST api/carrito/:id/productos/:id_prod
    .post(checkIfAdminMiddleware, async (req, res) => {
        const { id, id_prod } = req.params;
        // busco el carrito a actualizar
        const cartToUpdate = await carritoDb.getById(Number(id));
        // busco el producto a agregar
        const prodByID = await productDb.getById(Number(id_prod));
        // agrego el producto al objeto
        let cantidad = 1
        const item = cartToUpdate.productos.find(item => item.id === prodByID.id)
        if (!item) {
            const newItem = { ...prodByID, cantidad }
            cartToUpdate.productos.push(newItem)
        }
        else {
            item.cantidad++
        }
        
        // agrego el producto a la db
        const cart = await carritoDb.saveById(cartToUpdate)
        res.json(cart)
    })
    // DELETE api/carrito/:id/productos/:id_prod
    .delete(checkIfAdminMiddleware, async (req, res) => {
        const { id, id_prod } = req.params;
        // busco el carrito a actualizar
        const cartToUpdate = await carritoDb.getById(Number(id));
        // elimino el producto del carrito
        cartToUpdate.productos = cartToUpdate.productos.filter(item => item.id !== Number(id_prod))
        // agrego el producto a la db
        const cart = await carritoDb.saveById(cartToUpdate)
        res.json(cart)
    });

export default router;