import express, { json, urlencoded } from "express";
import productRouter from "./routes/product.route.js"
import index from "./routes/index.js"
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

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

app.listen(8080, (error) => {
    error
        ? console.log("Error al iniciar la app", error)
        : console.log("Servidor escuchando puerto 8080");
});