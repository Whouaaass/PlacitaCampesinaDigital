
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
                    .json({ message: "This session has expired. Please login" });
            }

            const { id } = decoded; // get user id from the decoded token
            const user = await connection.execute(`select * from usuario where usuid = ${id}`); // find user by that `id`
            const { USUCONTRASENIA: password, ...data } = user.rows[0]; // return user object without the password
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