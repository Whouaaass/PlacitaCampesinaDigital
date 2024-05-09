/**
 * @brief Este archivo contiene las rutas para el recurso de ofertas
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const connection = await db.connect();
    try {
        const result = await connection.execute("SELECT * FROM oferta");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// Todo: Refactorizar correctamente todas las rutas
router.get("/:id", async (req: Request, res: Response) => {
    const connection = await db.connect();
    const id = req.params.id;
    try {
        const result = await connection.execute(`SELECT * FROM municipio WHERE muncodigo = ${id}`);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "Municipio not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;