/**
 * @brief Este archivo contiene las rutas para el recurso de ofertas
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";
import { Verify } from "../controllers/auth";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });    
    const dbQuery = `BEGIN PAQ_FETCH.GET_OFERTAS(''); END;`;
    try {
        const resultdb = await connection.execute(dbQuery);
        res.json({ data: resultdb.implicitResults[0] });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
/*
router.get("/:id", async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    const { id } = req.params;
    const dbQuery = `SELECT * FROM v_ofertas WHERE id = :id`;
    try {
        const result = await connection.execute(dbQuery, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "Oferta not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: "Error Interno del servidor", errorNum: error.errorNum });
    }
});
*/

router.get("/user/:id", async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    const id = req.params.id;
    //const dbQuery = `SELECT * FROM v_ofertas WHERE usuid = ${id}`;
    const dbQuery = 'BEGIN PAQ_FETCH.GET_OFERTAS(:usuid, \'\'); END;';

    try {
        const resultdb = await connection.execute(dbQuery, [id]);
        const result = resultdb.implicitResults[0];
        res.status(200).json({ data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error Interno del servidor" });
    }
});

router.post("/", Verify, async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    console.log(req.body);
    const { name, user, quantity, price, expirationDate, description } = req.body;
    const dbInsertQuery = `BEGIN 
    PAQ_OFERTA.INSERTAR_OFERTA(:usuid,:nombre,TO_DATE(:fechaCaducidad,'YYYY-MM-DD'), :descripcion, :cantidad, :precio, 'Y' );
    END;`;
    try {
        await connection.execute(dbInsertQuery,
            [user.USUID, name, expirationDate, description, quantity, price]
        );
        res.status(201).json({ message: "Offer created" });
    } catch (error: any) {
        console.log(error);
        if (error.errorNum == 20013) {
            return res.status(500).json({ error: "La cantidad no puede ser menor o igual a 0", errorNum: error.errorNum });
        }
        if (error.errorNum == 20014) {
            return res.status(500).json({ error: "El precio no puede ser menor o igual a 0", errorNum: error.errorNum });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/edit", Verify, async (req: Request, res: Response) => {
    const connection = await db.connect();
    console.log(req.body)
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    const { offerid, user, name, quantity, price, expirationDate, description } = req.body;

    const dbQuery = 'BEGIN PAQ_OFERTA.ACTUALIZAR_OFERTA(:offerid, :usuid, :nombre, TO_DATE(:fechaCaducidad, \'YYYY-MM-DD\'), :descripcion, :cantidad, :precio, \'Y\'); END;'

    try {
        await connection.execute(dbQuery, [offerid, user.USUID, name, expirationDate, description, quantity, price]);
        res.status(201).json({ message: "Offer edited" });
    } catch (error: any) {
        console.log(JSON.stringify(error));
        res.status(500).json({ error: "Internal server error", errorNum: error.errorNum });
    }
});

router.delete("/:id", Verify, async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    const id = req.params.id;
    const dbQuery = `BEGIN PAQ_OFERTA.DESACTIVAR_OFERTA(${id}); END;`;
    try {
        await connection.execute(dbQuery);
        res.status(200).json({ message: "Offer deleted" });
    } catch (error: any) {
        console.log(error);

        res.status(500).json({ error: "Internal server error", errorNum: error.errorNum });
    }
});

module.exports = router;