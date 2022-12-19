import { Router } from "express";

const router = Router();

router.route("/")
    // GET
    .get((req, res) => {
        res.render("index.ejs")
    })

export default router; 