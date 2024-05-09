//const express = require("express");
/**
 * @brief Este archivo contiene las rutas para el recurso de usuarios
 */
const db = require('../dbInterface');
import express, { Request, Response } from "express";

const router = express.Router();

/** TODO: desactivar al final / ahora esta para pruebas */
router.get("/", async (req: Request, res: Response) => {       
    const connection = await db.connect();
    try {        
        const result = await connection.execute("SELECT * FROM usuario");    
        res.json(result.rows);        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en la base de datos");
        
    } finally {
        connection.close();
    } 
});

/**
 * @brief Valida las credenciales de un usuario
 */
router.post("/login", async (req: Request, res: Response) => {
    console.log(req.body);
    
    const connection = await db.connect();
    const { id, password } = req.body;    
    try {
        const result = await connection.execute(`SELECT usucontrasenia FROM usuario WHERE usuid = ${id}`);
        if (result.rows.length > 0) {
            const user = result.rows[0];        
            if (password === user.USUCONTRASENIA) { // replace with hashed password comparison in production
                res.json({ status: 'success', message: 'Login successful' });
            } else {
                res.status(401).json({ status: 'error', message: 'Invalid password' });
            }
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en la base de datos");
    } finally {
        connection.close();
    }
    
});

router.post("/signup", async (req: Request, res: Response) => {
    const connection = await db.connect();
    const { id, municipio, firstname, lastname, password, dir, agrocuaca, telnumber } = req.body;
    const campesino = agrocuaca === 'yes'? 'Campesino' : 'Comprador';
    const hashedPassword = password; // replace with hashed password in production
    const bdpetition = `begin registro_usuario.insertar_usuario(${id}, '${municipio}', '${firstname}', '${lastname}', '${dir}', ${telnumber}, '${hashedPassword}', '${campesino}'); end;`;
    console.log(bdpetition);
    console.log(req.body)
    try {        
        await connection.execute(bdpetition);
        res.json({ status: 'success', message: 'User created' });
    } catch (error: any) {    
        console.log(error);    
        res.status(500).json({ status: 'error', message: 'Database error', errorNum: error.errorNum });
    } finally {
        connection.close();
    }
});

module.exports = router;