/**
 * @brief Este archivo contiene las rutas para el recurso de ofertas
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";
import { Verify } from "../controllers/auth";

const router = express.Router();

router.post("/", Verify, async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    const {cart, user} = req.body;
    //EXECUTE comprar(compra_table_type(compra_type(3, 1), compra_type(4, 2)), 10492027);
    const stringCart = cart.map((item: any) => `compra_type(${item.offerid}, ${item.quantity})`).join(', ');
    
    const dbQuery = `BEGIN comprar(compra_table_type(${stringCart}), ${user.USUID}); END;`;    
    try {
        const result = await connection.execute(dbQuery);
        res.status(200).json({data: result.implicitResults[0]});
    } catch (error: any) {
        if (error.errorNum === 20001) {            
            return res.status(400).json({ error: 'No se pueden comprar más productos de los que existen', errorNum: 20001 });
        }
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;