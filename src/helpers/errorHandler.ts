import {Prisma } from '@prisma/client';
import {ErrorRequestHandler} from 'express';
import {HttpError} from 'http-errors';
import {ZodError} from 'zod';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {    
    if (err instanceof ZodError) {
        console.log("zod");
        
        return res.status(400).json({message: err.message});
    }
    if (err instanceof HttpError) {
        console.log("http");
        return res.status(err.status).json({message: err.message});
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            console.log("prisma");
            return res.status(409).json({
                message: `This ${
                    Array.isArray(err.meta?.target) ? err.meta?.target.join(', ') : 'field'
                } is already taken`,
            })
        }
        if (process.env.NODE_ENV === 'development') {
            return res.status(500).json({message: err.message});
        }
        res.sendStatus(500);
    }
}

export default errorHandler;
