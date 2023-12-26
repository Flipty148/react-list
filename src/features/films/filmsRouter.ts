import { Router } from "express";
import db from "../../db";
import { querySchema, uuidSchema } from "../../helpers/genericValidators";
import { verifyToken } from "../../auth";
import { filmCreateSchema } from "./filmsValidators";
import { isSelfFilm } from "../../auth";
import createHttpError from 'http-errors'

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
    const {original_name, russian_name, year, actors} = await filmCreateSchema.parseAsync(req.body);
    const film = await db.film.create({
        data: {
            original_name,
            russian_name,
            year,
            actors,
            userId
        }
    });
    res.json(film);
});

filmsRouter.delete('/:id', verifyToken, isSelfFilm, async(req, res) => {
    const id = await uuidSchema.parseAsync(req.params);
    const film = await db.film.delete({
        where: {id}
    });
    if (!film) throw new createHttpError.NotFound();
    res.sendStatus(200);
});

filmsRouter.patch('/:id', verifyToken, isSelfFilm, async(req, res) => {
    const id = await uuidSchema.parseAsync(req.params);
    const {original_name, russian_name, year, actors} = await filmCreateSchema.parseAsync(req.body);
    const film = await db.film.update({
        where: {id},
        data: {
            original_name,
            russian_name,
            year,
            actors
        }
    });
    if (!film) throw new createHttpError.NotFound();
    res.json(film);
});


export default filmsRouter;
