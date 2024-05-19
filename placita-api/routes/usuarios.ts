/**
 * @brief Este archivo contiene las rutas para el recurso de usuarios
 */
const db = require('../dbInterface');

import { Verify } from "../controllers/auth";
import express, { CookieOptions, Request, Response } from "express";
import jwt, { Secret } from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from "../config/index";

const router = express.Router();

/** TODO: desactivar al final / ahora esta para pruebas */
router.get("/", async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    try {
        const result = await connection.execute("SELECT * FROM usuario");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en la base de datos");

    } finally {
        connection?.close();
    }
});

/**
 * @brief Autentica al usuario
 */
router.get("/verify", Verify, async (req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        message: "Usuario autenticado",
        user: req.body.user
    });
 });

/**
 * @brief Valida las credenciales de inicio de sesión
 */
router.post("/login", async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    const { id, password } = req.body;
    try {
        const result = await connection.execute(`SELECT usucontrasenia, usutipo FROM usuario WHERE usuid = ${id}`);

        if (result.rows.length <= 0)
            return res.status(404).send("Usuario no encontrado");

        const user_data = result.rows[0];

        if (password != user_data.USUCONTRASENIA)
            return res.status(401).json({ status: 'error', message: 'Invalid password' });


        const options: CookieOptions = {
            maxAge: 20 * 60 * 1000, // 20 minutes para expirar
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "none",
        }
        const token = jwt.sign({ id }, SECRET_ACCESS_TOKEN as Secret, { expiresIn: '20m' });
        res.cookie('token', token, options);
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token: token,
            data: {
                userid: id,
                rol: user_data.USUTIPO
            }
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).send("Internal server error");
    } finally {
        connection?.close();
    }

});

/**
 * @brief Intenta ingresar un nuevo usuario en la base de datos
 */
router.post("/signup", async (req: Request, res: Response) => {
    const connection = await db.connect();
    if (!connection)
        return res.status(503).json({ error: "Error al conectar con la base de datos" });
    const { id, municipio, firstname, lastname, password, dir, agrocauca, telnumber } = req.body;
    const campesino = agrocauca === 'yes' ? 'Campesino' : 'Comprador';
    const hashedPassword = password; // replace with hashed password in production
    const bdpetition = `begin registro_usuario.insertar_usuario(${id}, '${municipio}', '${firstname}', '${lastname}', '${dir}', ${telnumber}, '${hashedPassword}', '${campesino}'); end;`;
    console.log(bdpetition);
    console.log(req.body)
    try {
        await connection.execute(bdpetition);
        res.json({
            status: 'success',
            message: 'User created',
        });
    } catch (error: any) {
        console.log(error);
        if (error.errorNum)
            res.status(500).json({ status: 'error', message: 'Oracle Database error', errorNum: error.errorNum });
        else if (error.code)
            res.status(500).json({ status: 'error', message: 'Server error', code: error.code });
        else {
            res.status(500).json({ status: 'error', message: 'Unknown error' });
        }
    } finally {
        connection?.close();
    }
});

module.exports = router;