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
        const result = await connection.execute("BEGIN PAQ_FETCH.GET_MUNICIPIOS; END;");
        return res.json({ data: result.implicitResults[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;