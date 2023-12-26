import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { verifyToken, isSelf } from '../../src/auth';
import cookieParser from 'cookie-parser';
import errorHandler from '../../src/helpers/errorHandler';

describe('verifyToken', () => {

    const app = express();
    beforeAll(() => {
        app.use(express.json());
        app.use(cookieParser());
        app.use(verifyToken);
        app.get('/', (req: Request, res: Response) => {
            res.json(req.body.user);
        });
        app.use(errorHandler);
    })

    it('should return 401 if no token is provided', async () => {
        const res = await request(app).get('/');
        expect(res.status).toEqual(401);
    })
    
    it('should return 401 if the token is invalid', async () => {
        const res = await request(app).get('/').set('Cookie', ['token=invalidToken']);
        expect(res.status).toEqual(401);
    })

    it('should call next if the token is valid', async () => {
        const token = jwt.sign({ id: 1, role: 'USER' }, process.env.SECRET!);
        const res = await request(app).get('/').set('Cookie', [`token=Bearer ${token}`]);
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual(1);
        expect(res.body.role).toEqual('USER');
    })

})

describe("isSelf", () => {

    const app = express();
    let token: string;
    beforeAll(() => {
        app.use(express.json());
        app.use(cookieParser());
        app.use(verifyToken);
        app.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await isSelf(req, res, () => {
                    res.json(req.body.user);
                });
            } catch (error) {
                next(error);
            }
        });
        app.use(errorHandler);
    })

    beforeAll(() => {
        token = jwt.sign({ id: 'e46f017e-d8b9-4a5d-a48f-2538bdc4e0cf', role: 'USER' }, process.env.SECRET!);
    })

    it('should return 400 if params id is not a valid uuid', async () => {
        const res = await request(app).get('/invalid').set('Cookie', [`token=Bearer ${token}`]);
        expect(res.status).toEqual(400);
    })

    it('should return 403 if user id does not match params id and user is not admin', async () => {
        const res = await request(app).get('/49372fda-434d-4051-8817-766627abb9b4').set('Cookie', [`token=Bearer ${token}`]);
        expect(res.status).toEqual(403);
    })

    it('should call next if user id matches params id', async () => {
        const res = await request(app).get('/e46f017e-d8b9-4a5d-a48f-2538bdc4e0cf').set('Cookie', [`token=Bearer ${token}`]);
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual('e46f017e-d8b9-4a5d-a48f-2538bdc4e0cf');
        expect(res.body.role).toEqual('USER');
    })

    it('should call next if user is an admin', async () => {
        const token = jwt.sign({ id: '49372fda-434d-4051-8817-766627abb9b4', role: 'ADMIN' }, process.env.SECRET!);
        const res = await request(app).get('/e46f017e-d8b9-4a5d-a48f-2538bdc4e0cf').set('Cookie', [`token=Bearer ${token}`]);
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual('49372fda-434d-4051-8817-766627abb9b4');
        expect(res.body.role).toEqual('ADMIN');
    })
})
