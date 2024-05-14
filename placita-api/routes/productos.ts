/**
 * @brief Este archivo contiene las rutas para el recurso de ofertas
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const connection = await db.connect();
    const sqltable = "producto";
    const dbQuery = `SELECT * FROM ${sqltable}`;
    try {
        const result = await connection.execute(dbQuery);
        res.status(200).json({ data: result.rows });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;