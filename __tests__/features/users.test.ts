import '../initTestsEnv';
import {app} from '../../src/app_express';
import request from 'supertest';
import {parse} from 'cookie';
import { jwtVerify } from '../../src/auth';
import {clear, seedTest} from '../../prisma/seed/index';
import { userIds } from '../../prisma/seed/seedIdsTest';

describe('users', ()=> {
    let userCookie: Record<string, string> = {token: '' };
    let adminCookie: Record<string, string> = {token: '' };

    beforeAll(async () => {
        await clear();
        await seedTest();
    });
    beforeAll(async () => {
        const res = await request(app).post('/users/login').send({
            email: 'test1@mail.ru',
            password: 'admin12345'
        });
        adminCookie = parse(res.headers['set-cookie'][0]);
    });
    beforeAll(async ()=> {
        const res = await request(app).post('/users/login').send({
            email: "test2@mail.ru",
            password: "user12345"
        });
        userCookie = parse(res.headers['set-cookie'][0])
    })

    describe('Login user', ()=> {

        it('login user with correct credentials', async ()=> {
            const res = await request(app).post('/users/login').send({
                email: 'test1@mail.ru',
                password: 'admin12345'
            });

            expect(res.status).toEqual(200);
        })

        it('login user with incorrect credentials', async ()=> {
            const res = await request(app).post('/users/login').send({
                email: 'test12@mail.ru',
                password: 'admin123456'
            });

            expect(res.status).toEqual(401);
            expect(res.body).toEqual({message: 'Unauthorized'});
        })

        it('login user with incorrect email', async ()=> {
            const res = await request(app).post('/users/login').send({
                email: 'test12@mail.ru',
                password: 'admin123456'
            });

            expect(res.status).toEqual(401);
            expect(res.body).toEqual({message: 'Unauthorized'});
        })

        it('login user with incorrect password', async ()=> {
            const res = await request(app).post('/users/login').send({
                email: 'test1@mail.ru',
                password: 'user123456'
            });

            expect(res.status).toEqual(401);
            expect(res.body).toEqual({message: 'Unauthorized'});
        })

        it('success login user', async ()=> {
            expect(userCookie.token).toMatch(/^Bearer\s+.+$/);
            const token = userCookie.token.split(/\s+/)[1];
            const decoded = await jwtVerify(token, process.env.SECRET!);
            expect(decoded).toEqual({
                id: expect.any(String),
                iat: expect.any(Number),
                role: 'USER'
            });
        })

        it('success login admin', async ()=> {
            expect(adminCookie.token).toMatch(/^Bearer\s+.+$/);
            const token = adminCookie.token.split(/\s+/)[1];
            const decoded = await jwtVerify(token, process.env.SECRET!);
            expect(decoded).toEqual({
                id: expect.any(String),
                iat: expect.any(Number),
                role: 'ADMIN'
            });
        })
    });

    describe('Register user', ()=> {
        it('register user with correct credentionals', async () => {
            const res = await request(app).post('/users/signup').send({
                email: 'test15@mail.ru',
                password: 'user12345'
            });

            expect(res.statusCode).toEqual(200);
            const bearerToken = parse(res.headers['set-cookie'][0]).token;
            expect(bearerToken).toMatch(/^Bearer\s+.+$/);
            const token = bearerToken.split(/\s+/)[1];
            const decoded = await jwtVerify(token, process.env.SECRET!);
            expect(decoded).toEqual({
                id: expect.any(String),
                iat: expect.any(Number),
                role: 'USER'
            });
        })

        it('register user with exist email', async () => {
            const res = await request(app).post('/users/signup').send({
                email: 'test1@mail.ru',
                password: 'user12345'
            });

            expect(res.statusCode).toEqual(409);
            expect(res.body).toEqual({message: 'This email is already taken'});
        })
    })

    describe('Get user', ()=> {
        it('get all users without token', async ()=> {
            const res = await request(app).get('/users');
            expect(res.status).toEqual(401);
        })

        it('get all users as user', async ()=> {
            const res = await request(app).get('/users').set('Cookie', `token=${userCookie.token}`);
            expect(res.status).toEqual(403);
        })

        it('get all users as admin', async ()=> {
            const res = await request(app).get('/users').set('Cookie', `token=${adminCookie.token}`);
            expect(res.status).toEqual(200);
        })

        it('get user by id as user', async ()=> {
            const res = await request(app).get('/users/' + userIds[1]).set('Cookie', `token=${userCookie.token}`);
            
            expect(res.status).toEqual(200);
            expect(res.body.id).toEqual(userIds[1]);
            expect(res.body.password).toBeUndefined();
            expect(res.body.role).toEqual('USER');
        })

        it('get user by id as admin', async ()=> {
            const res = await request(app).get('/users/' + userIds[1]).set('Cookie', `token=${adminCookie.token}`);
            
            expect(res.status).toEqual(200);
            expect(res.body.id).toEqual(userIds[1]);
            expect(res.body.password).toBeUndefined();
            expect(res.body.role).toEqual('USER');
        })

        it('get user by id as another user', async ()=> {
            const res = await request(app).get('/users/' + userIds[2]).set('Cookie', `token=${userCookie.token}`);
            
            expect(res.status).toEqual(403);
        })
    
    })

    describe('Create user', () => {
        it('create user as user', async ()=> {
            const res = await request(app).post('/users').set('Cookie', `token=${userCookie.token}`).send({
                email: 'test16@mail.ru',
                password: 'user12345'
            });

            expect(res.status).toEqual(403);
        })

        it('create user as admin', async ()=> {
            const res = await request(app).post('/users').set('Cookie', `token=${adminCookie.token}`).send({
                email: 'test16@mail.ru',
                password: 'user12345',
                role: 'USER',
                name: 'User16'
            });

            expect(res.status).toEqual(200);
            expect(res.body.id).toEqual(expect.any(String));
            expect(res.body.role).toEqual('USER');
            expect(res.body.password).toBeUndefined();
        })
    })

    describe('Update user', () => {
        it('update user as another user', async ()=> {
            const res = await request(app).patch('/users/' + userIds[2]).set('Cookie', `token=${userCookie.token}`).send({
                name: 'User2'
            });

            expect(res.status).toEqual(403);
        })

        it('update user as user', async ()=> {
            const res = await request(app).patch('/users/' + userIds[1]).set('Cookie', `token=${userCookie.token}`).send({
                name: 'User1'
            });

            expect(res.status).toEqual(200);
        })

        it('update user as admin', async ()=> {
            const res = await request(app).patch('/users/' + userIds[2]).set('Cookie', `token=${adminCookie.token}`).send({
                name: 'User2'
            });

            expect(res.status).toEqual(200);
        })
    })

    describe('Delete user', () => {
        it('delete user as another user', async ()=> {
            const res = await request(app).delete('/users/' + userIds[2]).set('Cookie', `token=${userCookie.token}`);
            expect(res.status).toEqual(403);
        })

        it('delete user as user', async ()=> {
            const res = await request(app).delete('/users/' + userIds[1]).set('Cookie', `token=${userCookie.token}`);
            expect(res.status).toEqual(200);
        })

        it('delete user as admin', async ()=> {
            const res = await request(app).delete('/users/' + userIds[2]).set('Cookie', `token=${adminCookie.token}`);
            expect(res.status).toEqual(200);
        })
    })
})
