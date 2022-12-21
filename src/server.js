import express, { json, urlencoded } from "express";
import productRoute from "./routes/product.route.js"
import indexRoute from "./routes/index.route.js"
import cartRoute from "./routes/cart.route.js"
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { Server as IOServer } from "socket.io";
import MessageRepository from './repositories/MessageRepository.js'
import ProductRepository from './repositories/ProductRepository.js'

// settings
const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "/uploads")));
app.use(express.static(__dirname + "/public"));

// routes
app.use("/api/productos", productRoute)
app.use("/api/carrito", cartRoute)
app.get("/", indexRoute)

// ejs
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")

app.use((req, res, next) => {
    console.log(`X ${req.method} - ${req.path}`);
    next();
})

// listener
const expressServer = app.listen(PORT, (error) => {
    error
        ? console.log("Error al iniciar la app", error)
        : console.log("Servidor escuchando puerto 8080");
});

const io = new IOServer(expressServer);

io.on("connection", async (socket) => {
    console.log(`New connection, socket ID: ${socket.id}`);

    socket.emit("server:message", await MessageRepository.getAll());
    socket.emit("server:product", await ProductRepository.getAll());

    socket.on("client:message", async (messageInfo) => {
        await MessageRepository.save(messageInfo);
        io.emit("server:message", await MessageRepository.getAll());
    });

    socket.on("client:product", async (productInfo) => {
        await ProductRepository.save(productInfo);
        io.emit("server:product", await ProductRepository.getAll());
    });
});

app.on("error", (err) => {
    console.log(err);
});
