//const express = require("express");
/**
 * @brief Este archivo contiene las rutas para el recurso de municipios
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";


const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const connection = await db.connect();
    try {
        const result = await connection.execute("SELECT * FROM municipio");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    } finally {
        connection.close();
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
    } catch (error: any) {
        res.status(500).json({ error: "Internal server error", errorNum: error.errorNum });
    } finally {
        connection.close();
    }
});

module.exports = router;