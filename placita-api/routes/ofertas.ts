/**
 * @brief Este archivo contiene las rutas para el recurso de ofertas
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const connection = await db.connect();
    const sqltable = "vista_ofertas_disponibles";
    const dbQuery = `SELECT * FROM ${sqltable}`;
    try {
        const result = await connection.execute(dbQuery);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// Todo: Refactorizar correctamente todas las rutas
router.get("/:id", async (req: Request, res: Response) => {
    const connection = await db.connect();
    const id = req.params.id;
    const dbQuery = `SELECT * FROM ofeId WHERE ofecodigo = ${id}`;
    try {
        const result = await connection.execute(dbQuery);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "Oferta not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: "Internal server error", errorNum: error.errorNum});
    }
});

module.exports = router;