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
        const resultdb = await connection.execute(`BEGIN PAQ_FETCH.GET_USUARIO(:id); END;`, [ id ]);
        const result = resultdb.implicitResults[0];

        if (result.length <= 0)
            return res.status(404).json({ status: 404, error: "Usuario no encontrado" });

        const user_data = result[0];

        if (password != user_data.USUCONTRASENIA)
            return res.status(401).json({ status: 401, error: 'Contraseña incorrecta' });


        const options: CookieOptions = {
            maxAge: 2 * 60 * 60 * 1000, //  2 horas para expirar
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "none",
        }
        const token = jwt.sign({ id }, SECRET_ACCESS_TOKEN as Secret, { expiresIn: '2h' });
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
    const bdpetition = `begin paq_usuario.insertar_usuario(${id}, '${municipio}', '${firstname}', '${lastname}', '${dir}', ${telnumber}, '${hashedPassword}', '${campesino}'); end;`;
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
        if (error.errorNum === 1)
            return res.status(400).json({ error: 'La cedula ya se encuentra registrada', errorNum: error.errorNum });
        if (error.errorNum === 20001)
            return res.status(400).json({ error: 'La cedula tiene una longuitud menor a 8', errorNum: error.errorNum });
        if (error.errorNum === 1438)
            return res.status(400).json({ error: 'Error en el formato de la cedula', errorNum: error.errorNum });
        if (error.code)
            return res.status(500).json({ error: 'Error del sevidor', code: error.code });
                
        res.status(500).json({ error: 'Error Interno del servidor' });
        
    } finally {
        connection?.close();
    }
});

module.exports = router;