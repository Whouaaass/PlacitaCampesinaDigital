/**
 * @brief Este archivo contiene las rutas para el recurso de ofertas
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const connection = await db.connect();    
    const dbQuery = `BEGIN PAQ_FETCH.GET_PRODUCTOS; END;`;
    try {
        const resultdb = await connection.execute(dbQuery);
        res.status(200).json({ data: resultdb.implicitResults[0] });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;