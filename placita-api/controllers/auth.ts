
const db = require('../dbInterface');
import jwt, { Secret } from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {SECRET_ACCESS_TOKEN} from "../config/index";

export async function Verify(req : Request , res: Response, next: NextFunction) {
    try {
        const connection = await db.connect();
        const authHeader = req.headers["token"];
                
        if (!authHeader) return res.sendStatus(404); // if there is no cookie from request header, send an unauthorized response.
        const cookie = (authHeader as string).split("=")[1]; // If there is, split the cookie string to get the actual jwt

        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie
        jwt.verify(cookie, SECRET_ACCESS_TOKEN as Secret, async (err, decoded : any) => {
            if (err) {
                // if token has been altered or has expired, return an unauthorized error
                return res
                    .status(401)
                    .json({ error: "La sesión a expirado, por favor inicie sesión de nuevo" });
            }

            const { id } = decoded; // get user id from the decoded token
            const resultdb = await connection.execute(`BEGIN PAQ_FETCH.GET_USUARIO(:id); END;`, [ id ]);; // find user by that `id`
            const users = resultdb.implicitResults[0]; // get the user object from the result
            if (users.length <= 0) return res.status(404).json({ status: 404, error: "Usuario no encontrado o eliminado" }); // if user is not found, return a not found error
            const { USUCONTRASENIA: password, ...data } = users[0]; // return user object without the password
            req.body.user = data;
            next();
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}