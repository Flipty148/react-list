import db from '../db'
import {RequestUser} from '../helpers/types'
import { uuidSchema } from '../helpers/genericValidators'
import { NextFunction, Response } from 'express'
import createHttpError from 'http-errors'

export async function isSelf(
    req: RequestUser,
    res: Response,
    next: NextFunction
) {
    const id = await uuidSchema.parseAsync(req.params.id)
    if (req.body.user?.id !== id && req.body.user?.role !== 'ADMIN') {
        return new createHttpError.Forbidden();
    }
    next()
     
}

export function isAdmin(
    req: RequestUser,
    res: Response,
    next: NextFunction
) {
    if (req.body.user.role !== 'ADMIN') {
        return new createHttpError.Forbidden();
    }
    next()
}
