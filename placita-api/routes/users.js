const express = require("express");

const router = express.Router();

const idLength = 8;

router.get("/", async (req, res) => {        
    const connection = await req.app.db.connect();
    const result = await connection.execute("SELECT * FROM users");    
    res.json(result.rows);
    connection.close();
});

router.get("/:id", async (req, res) => {    
    const connection = await req.app.db.connect();
    const result = await connection.execute(`SELECT * FROM users WHERE id = ${req.params.id}`);
    res.json(result.rows);
    connection.close();
});

router.post("/", async (req, res) => {
    const connection = await req.app.db.connect();
    const { firstname } = req.body;
    const id = Math.floor(Math.random() * Math.pow(10, idLength));
    const result = await connection.execute(`INSERT INTO users VALUES (${id}, '${firstname}')`);
    res.json(result);
    connection.commit();
    connection.close();
});


module.exports = router;