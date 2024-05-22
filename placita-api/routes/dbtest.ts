const db = require('../dbInterface');
import express, { Request, Response } from "express";

const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    try {
        const user_tables = await connection.execute("SELECT TABLE_NAME FROM USER_TABLES");
        const user_views = await connection.execute("SELECT VIEW_NAME FROM USER_VIEWS");
        const user_triggers = await connection.execute("SELECT TRIGGER_NAME FROM USER_TRIGGERS");
        const user_procedures = await connection.execute("SELECT OBJECT_NAME, PROCEDURE_NAME, OBJECT_TYPE FROM USER_PROCEDURES");
        const user_sequences = await connection.execute("SELECT SEQUENCE_NAME, LAST_NUMBER FROM USER_SEQUENCES");
        res.status(200).json({
            tables: user_tables.rows,
            views: user_views.rows,
            triggers: user_triggers.rows,
            procedures: user_procedures.rows,
            sequences: user_sequences.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en la base de datos");
    }
});

router.get("/loadDB", async (req: Request, res: Response) => {

});


router.get("/experimental", async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    try {
        const data = await connection.execute(`
        declare
            rc sys_refcursor;
        begin
            open rc for select * from oferta inner join producto on oferta.proid = producto.proid;
            dbms_sql.return_result(rc);
        end;
        `);
        res.json({data: data})

    } catch (error) {
        console.error(error);
        res.status(500).send("Error en la base de datos");
    }
});


module.exports = router;