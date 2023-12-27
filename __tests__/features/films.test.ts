// import '../initTestsEnv';
import {app} from '../../src/app_express'
import request from 'supertest'
import {parse} from 'cookie'
import {clear, seedTest} from '../../prisma/seed/index'
import { filmIds, userIds } from '../../prisma/seed/seedIdsTest'

describe("films", () => {

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

    describe("Get films", ()=>{

        it('get all films without token', async ()=> {
            const res = await request(app).get('/films');
            expect(res.status).toEqual(401);
        })

        it('get all films as user', async ()=> {
            const res = await request(app).get('/films').set('Cookie', `token=${userCookie.token}`);
            
            expect(res.status).toEqual(200);
            expect(res.body[0].id).toEqual(filmIds[0]);
            expect(res.body[1].id).toEqual(filmIds[2]);
        })

        it('get film as user', async ()=> {
            const res = await request(app).get('/films/' + filmIds[0]).set('Cookie', `token=${userCookie.token}`);
            
            expect(res.status).toEqual(200);
            expect(res.body.id).toEqual(filmIds[0]);
        })

        it('get film as admin', async ()=> {
            const res = await request(app).get('/films/' + filmIds[0]).set('Cookie', `token=${adminCookie.token}`);
            
            expect(res.status).toEqual(200);
            expect(res.body.id).toEqual(filmIds[0]);
        })

        it('get film as another user', async ()=> {
            const res = await request(app).get('/films/' + filmIds[1]).set('Cookie', `token=${userCookie.token}`);
            
            expect(res.status).toEqual(403);
        })
    })

    describe("Append film", ()=>{

        it('append one film', async ()=> {
            const res = await request(app).post('/films').send({
                original_name: 'test',
                russian_name: 'тест',
                year: '2000',
                actors: 'test, test'
            }).set('Cookie', `token=${userCookie.token}`);

            expect(res.status).toEqual(200);
            expect(res.body.original_name).toEqual('test');
            expect(res.body.russian_name).toEqual('тест');
            expect(res.body.year).toEqual(2000);
            expect(res.body.actors).toEqual('test, test');
            expect(res.body.userId).toEqual(userIds[1]);
        })

        it('append few films', async ()=> {
            const res = await request(app).post('/films').send([{
                original_name: 'test1',
                russian_name: 'тест1',
                year: '2000',
                actors: 'test, test'
            },
            {
                original_name: 'test2',
                russian_name: 'тест2',
                year: '2000',
                actors: 'test, test'}])
            .set('Cookie', `token=${userCookie.token}`);

            expect(res.status) .toEqual(200);
            expect(res.body[0].original_name).toEqual('test1');
            expect(res.body[0].russian_name).toEqual('тест1');
            expect(res.body[0].year).toEqual(2000);
            expect(res.body[0].actors).toEqual('test, test');
            expect(res.body[0].userId).toEqual(userIds[1]);
            expect(res.body[1].original_name).toEqual('test2');
            expect(res.body[1].russian_name).toEqual('тест2');
            expect(res.body[1].year).toEqual(2000);
            expect(res.body[1].actors).toEqual('test, test');
            expect(res.body[1].userId).toEqual(userIds[1]);
        })
    })

    describe("Update film", ()=>{

        it('update film', async ()=> {
            const res = await request(app).patch('/films/' + filmIds[0]).send({
                original_name: 'test',
                russian_name: 'тест',
                year: '2000',
                actors: 'test, test'
            }).set('Cookie', `token=${userCookie.token}`);

            expect(res.status).toEqual(200);
            expect(res.body.original_name).toEqual('test');
            expect(res.body.russian_name).toEqual('тест');
            expect(res.body.year).toEqual(2000);
            expect(res.body.actors).toEqual('test, test');
            expect(res.body.userId).toEqual(userIds[1]);
        })

        it('update film as another user', async ()=> {
            const res = await request(app).patch('/films/' + filmIds[1]).send({
                original_name: 'test',
                russian_name: 'тест',
                year: '2000',
                actors: 'test, test'
            }).set('Cookie', `token=${userCookie.token}`);
            
            expect(res.status).toEqual(403);
        })
    })

    describe("Delete film", ()=>{

        it('delete film', async ()=> {
            const res = await request(app).delete('/films/' + filmIds[0]).set('Cookie', `token=${userCookie.token}`);
            
            expect(res.status).toEqual(200);
        })

        it('delete film as another user', async ()=> {
            const res = await request(app).delete('/films/' + filmIds[1]).set('Cookie', `token=${userCookie.token}`);
            
            expect(res.status).toEqual(403);
        })
    })
})

