import express, { json, urlencoded } from "express";
import productRouter from "./routes/product.route.js"
import index from "./routes/index.js"
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { Server as IOServer } from "socket.io";
import productDb from "./repository/ProductoRepository.js"
import msgDB from "./repository/MensajeRepository.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

// multer
app.use("/images", express.static(path.join(__dirname, "/uploads")));

// ejs
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")

app.use((req, res, next) => {
    console.log(`X ${req.method} - ${req.path}`);
    next();
})

// routes
app.use("/api/productos", productRouter)
app.use("/", index)

const expressServer = app.listen(8080, (error) => {
    error
        ? console.log("Error al iniciar la app", error)
        : console.log("Servidor escuchando puerto 8080");
});

const io = new IOServer(expressServer);

app.use(express.static(__dirname + "/public"));

io.on("connection", async (socket) => {
    console.log(`New connection, socket ID: ${socket.id}`);

    // productos
    const products = await productDb.getAll();
    socket.emit("server:product", products);

    socket.on("client:product", (productInfo) => {
        productDb.save(productInfo)
        products.push(productInfo)
        io.emit("server:product", products);
    });

    // mensajes
    const msgs = await msgDB.getAll();
    socket.emit("server:msg", msgs);

    socket.on("client:msg", (msgInfo) => {
        msgDB.save(msgInfo)
        msgs.push(msgInfo)
        io.emit("server:msg", msgs);
    });
});

