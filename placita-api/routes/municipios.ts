/**
 * @brief Este archivo contiene las rutas para el recurso de municipios
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";

const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    try {
        const result = await connection.execute("SELECT * FROM municipio");
        return res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    try {                
        const result = await connection.execute(`SELECT * FROM municipio WHERE muncodigo = ${id}`);
        if (result.rows.length > 0) {
            res.json({data: result.rows[0]});
        } else {
            res.status(404).json({ error: "Municipio no encontrado" });
        }
    } catch (error: any) {
        res.status(500).json({ error: "Error interno del servidor", errorNum: error.errorNum });
    }
});

module.exports = router;