import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { RequestUser } from "../helpers/types";
import jwt, {jwtVerify} from "./jwt";

export async function verifyToken(
    req: RequestUser,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies?.token;
    if (typeof token === "string") {
        try {
            const bearerToken = token.split(" ")[1]
            const data = await jwtVerify(bearerToken, process.env.SECRET!);
            if (!data || typeof data !== 'object') {
                throw new createHttpError.Unauthorized();
            }
            req.body.user = {
                id: data.id,
                role: data.role
            };
            next();
        }
        catch (e) {
            throw new createHttpError.Unauthorized();
        }
    }
    else {
        throw new createHttpError.Unauthorized();
    }
}

export function createToken(
    data: object
) {
    return jwt.sign(data, process.env.SECRET!, { expiresIn: "1h" });
}

export function deleteToken(
    req: RequestUser,
    res: Response
) {
    res.clearCookie("token");
    res.sendStatus(200);
}

export function setToken(
    res: Response,
    data: object
) {
    const token = createToken(data);
    res.cookie("token", `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
    });
    res.sendStatus(200);
}

