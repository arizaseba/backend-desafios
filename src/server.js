import express, { json, urlencoded } from "express";
import productRoute from "./routes/product.route.js"
import indexRoute from "./routes/index.route.js"
import cartRoute from "./routes/cart.route.js"
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { Server as IOServer } from "socket.io";
import messageDB from './repositories/MessageRepository.js'

// settings
const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// middlewares
app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "/uploads")));

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

app.use(express.static(__dirname + "/public"));

io.on("connection", async (socket) => {
    console.log(`New connection, socket ID: ${socket.id}`);

    // mensajes
    const msgs = await messageDB.getAll();
    socket.emit("server:msg", msgs);

    socket.on("client:msg", (msgInfo) => {
        messageDB.save(msgInfo)
        msgs.push(msgInfo)
        io.emit("server:msg", msgs);
    });
});