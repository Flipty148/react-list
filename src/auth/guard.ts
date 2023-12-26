import db from '../db'
import {RequestUser} from '../helpers/types'
import { uuidSchema } from '../helpers/genericValidators'
import { NextFunction, Response } from 'express'
import createHttpError from 'http-errors'

export async function isSelf(
    req: RequestUser,
    _res: Response,
    next: NextFunction
) {
    const id = await uuidSchema.parseAsync(req.params.id)
    if (req.body.user?.id !== id && req.body.user?.role !== 'ADMIN') {
        throw new createHttpError.Forbidden();
    }
    next()
     
}

export function isAdmin(
    req: RequestUser,
    _res: Response,
    next: NextFunction
) {
    if (req.body.user.role !== 'ADMIN') {
        throw new createHttpError.Forbidden();
    }
    next()
}

export async function isSelfFilm(
    req: RequestUser,
    _res: Response,
    next: NextFunction
) {
    if (req.body.user.role === 'ADMIN') {
        return next();
    }
    const id = await uuidSchema.parseAsync(req.params.id)
    const userId = req.body.user?.id
    const film = await db.film.findMany({
        where: {
            id,
            userId
        }
    })
    if (film) return next();
    throw new createHttpError.Forbidden();
}
