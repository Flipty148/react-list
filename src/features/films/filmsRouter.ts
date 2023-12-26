import { Router } from "express";
import db from "../../db";
import { querySchema, uuidSchema } from "../../helpers/genericValidators";
import { verifyToken } from "../../auth";
import { filmCreateSchema } from "./filmsValidators";
import { isSelfFilm } from "../../auth";
import createHttpError from 'http-errors'
import { Film } from "@prisma/client";

const filmsRouter = Router();

filmsRouter.get('/', verifyToken, async (req, res) => {
    const userId = req.body.user?.id;
    const {limit, offset} = await querySchema.parseAsync(req.query);
    const films = await db.film.findMany({
        skip: offset,
        take: limit,
        where: {
            userId
        }
    });
    res.json(films);
});

filmsRouter.post('/', verifyToken, async (req, res) => {
    const userId = req.body.user?.id;
    if (!userId) throw new createHttpError.Unauthorized();
    if (Array.isArray(req.body)){
        let films = [] as Film[];
        req.body.forEach((f) => {
        const {original_name, russian_name, year, actors} = filmCreateSchema.parse(f);
        const yearNumber = Number(year);
        const film = {
            original_name: original_name,
            russian_name: russian_name,
            year: yearNumber,
            actors: actors,
            userId: userId
        } as Film;
        films.push(film);
        });
        const filmsMany = db.film.createMany({
            data: films
        });
        await db.$transaction([filmsMany]);
        await db.$disconnect();
        res.json(films);
    }
    else {
        const {original_name, russian_name, year, actors} = await filmCreateSchema.parseAsync(req.body);
        const yearNumber = Number(year);
        const film = db.film.create({
            data: {
                original_name: original_name,
                russian_name: russian_name,
                year: yearNumber,
                actors: actors,
                userId: userId
            }
        });
        await db.$transaction([film]);
        await db.$disconnect();
        res.json(film);
    }
    
});

filmsRouter.delete('/:id', verifyToken, isSelfFilm, async(req, res) => {
    const id = await uuidSchema.parseAsync(req.params.id);
    const film = await db.film.delete({
        where: {id}
    });
    if (!film) throw new createHttpError.NotFound();
    res.sendStatus(200);
});

filmsRouter.patch('/:id', verifyToken, isSelfFilm, async(req, res) => {
    const id = await uuidSchema.parseAsync(req.params.id);
    const {original_name, russian_name, year, actors} = await filmCreateSchema.parseAsync(req.body);
    const yearNumber = Number(year);
    const film = await db.film.update({
        where: {id},
        data: {
            original_name,
            russian_name,
            year: yearNumber,
            actors
        }
    });
    if (!film) throw new createHttpError.NotFound();
    res.json(film);
});

filmsRouter.get('/:id', verifyToken, isSelfFilm, async(req, res) => {
    const id = await uuidSchema.parseAsync(req.params.id);
    const film = await db.film.findUnique({
        where: {id}
    });
    if (!film) throw new createHttpError.NotFound();
    res.json(film);
});


export default filmsRouter;
