import {Router} from "express";
import db from "../../db";
import {
    isAdmin,
    isSelf,
    setToken,
    verifyToken,
    comparePasswordHash,
    createPasswordHash
} from "../../auth";
import {querySchema, uuidSchema} from "../../helpers/genericValidators";
import {
    credentialsSchema,
    userCreateSchema,
    userUpdateSchema
} from "./usersValidators";
import {Prisma} from "@prisma/client";
import createHttpError from "http-errors";

const usersRouter = Router();

usersRouter.get('/', verifyToken, isAdmin, async (req, res) => {
    const {limit, offset} = await querySchema.parseAsync(req.query);
    const users = await db.user.findMany({
        skip: offset,
        take: limit,
        select: {
            id: true,
            email: true,
            name: true,
            role: true
        }
    });
    res.json(users);
});

usersRouter.get('/:id', verifyToken, isSelf, async (req, res) => {
    const id = await uuidSchema.parseAsync(req.params.id);
    const user = await db.user.findUnique({
        where: {id},
        select: {
            id: true,
            email: true,
            name: true,
            role: true
        }
    });
    if (!user) throw new createHttpError.NotFound();
    res.json(user);
});

usersRouter.post('/', verifyToken, isAdmin, async (req, res) => {
    const {email, password, role, name} = await userCreateSchema.parseAsync(req.body);
    const user = await db.user.create({
        data: {
            email,
            password: await createPasswordHash(password),
            name,
            role
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true
        }
    });
    res.json(user);
});

usersRouter.patch('/:id', verifyToken, isSelf, async (req, res) => {
    const id = await uuidSchema.parseAsync(req.params);
    const {email, password, role, name} = await userUpdateSchema.parseAsync(req.body);
    const updatedData: Prisma.UserUpdateInput = {};
    if (email) updatedData.email = email;
    if (password) updatedData.password = await createPasswordHash(password);
    if (role && req.body.user.role === 'ADMIN') updatedData.role = role;
    if (name) updatedData.name = name;
    const user = await db.user.update({
        where: {id},
        data: updatedData,
        select: {
            id: true,
            email: true,
            name: true,
            role: true
        }
    });
    if (!user) throw new createHttpError.NotFound();
    res.json(user);
});

usersRouter.delete('/:id', verifyToken, isSelf, async (req, res) => {
    const id = await uuidSchema.parseAsync(req.params);
    const user = await db.user.delete({
        where: {id}
    });
    if (!user) throw new createHttpError.NotFound();
    res.sendStatus(200);
});

usersRouter.post('/login', async (req, res) => {
    console.log(req.body);
    
    const {email, password} = await credentialsSchema.parseAsync(req.body);
   
    const user = await db.user.findUnique({
        where: {email}
    });
    if (!user) throw new createHttpError.Unauthorized();
    if (!await comparePasswordHash(password, user.password)) throw new createHttpError.Unauthorized();
    setToken(res, {
        id: user.id,
        role: user.role
    });
});

usersRouter.post('/logout', async (req, res) => {
    res.clearCookie("token");
    res.sendStatus(200);
});

usersRouter.post('/signup', async (req, res) => {
    const {email, password} = await credentialsSchema.parseAsync(req.body);
    const user = await db.user.create({
        data: {
            email,
            password: await createPasswordHash(password),
        }
    });
    setToken(res, {
        id: user.id,
        role: user.role
    });
});

export default usersRouter;
