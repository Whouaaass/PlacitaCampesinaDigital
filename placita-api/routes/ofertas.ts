/**
 * @brief Este archivo contiene las rutas para el recurso de ofertas
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";
import { Verify } from "../controllers/auth";

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

router.get("/user/:id", async (req: Request, res: Response) => {
    const connection = await db.connect();
    const id = req.params.id;
    const dbQuery = `SELECT * FROM vista_ofertas_disponibles WHERE usuid = ${id}`;
    try {
        const result = await connection.execute(dbQuery);
        res.status(200).json({data: result.rows});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", Verify, async (req: Request, res: Response) => {
    const connection = await db.connect();
    console.log(req.body);
    const { name, user, quantity, price, expirationDate, description } = req.body;
    const dbQuery = `BEGIN 
    PAQ_OFERTA.INSERTAR_OFERTA(${user.USUID},'${name}',TO_DATE('${expirationDate}','YYYY-MM-DD'), '${description}', ${quantity}, ${price}, 'Y' ); 
    END;`;
    try {
        await connection.execute(dbQuery);
        res.status(201).json({ message: "Offer created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/edit", Verify, async (req: Request, res: Response) => {
    const connection = await db.connect();
    const { id, user, name, quantity, price, expirationDate, description } = req.body;
    const dbQuery = `BEGIN 
    PAQ_OFERTA.ACTUALIZAR_OFERTA(${id}, ${user.USUID}, '${name}',TO_DATE('${expirationDate}','YYYY-MM-DD'), '${description}', ${quantity}, ${price}, 'Y' ); 
    END;`;
    try {
        await connection.execute(dbQuery);
        res.status(201).json({ message: "Offer edited" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;