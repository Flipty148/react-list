import {userIds} from './seedIds';
import {userIds as userIdsTest, filmIds as filmIdsTest} from './seedIdsTest';
import db from '../../src/db';
import {createPasswordHash} from '../../src/auth';

export async function seed() {
    await clear();
    const users = db.user.createMany({
        data: [
            {
                id: userIds[0],
                email: 'test1@mail.ru',
                name: 'Admin',
                password : await createPasswordHash('admin12345'),
                role: 'ADMIN'
            },
            {
                id: userIds[1],
                email: 'test2@mail.ru',
                name: 'User1',
                password : await createPasswordHash('user12345')
            },
            {
                id: userIds[2],
                email: 'test3@mail.ru',
                name: 'User2',
                password : await createPasswordHash('user12345')
            }
        ]});

    await db.$transaction([users]);
    await db.$disconnect();
}

export async function seedTest() {
    await clear();
    const users = db.user.createMany({
        data: [
            {
                id: userIdsTest[0],
                email: 'test1@mail.ru',
                name: 'Admin',
                password : await createPasswordHash('admin12345'),
                role: 'ADMIN'
            },
            {
                id: userIdsTest[1],
                email: 'test2@mail.ru',
                name: 'User1',
                password : await createPasswordHash('user12345')
            },
            {
                id: userIdsTest[2],
                email: 'test3@mail.ru',
                name: 'User2',
                password : await createPasswordHash('user12345')
            }
    ]});
    const films = db.film.createMany({
        data: [
            {
                id: filmIdsTest[0],
                original_name: 'film1',
                russian_name: 'фильм1',
                year: 1970,
                actors: 'актер1, актер2',
                userId: userIdsTest[1]
            },
            {
                id: filmIdsTest[1],
                original_name: 'film2',
                russian_name: 'фильм2',
                year: 2012,
                actors: 'актер3',
                userId: userIdsTest[2]
            },
            {
                id: filmIdsTest[2],
                original_name: 'film3',
                russian_name: 'фильм3',
                year: 2023,
                actors: 'актер4, актер5, актер6',
                userId: userIdsTest[1]
            }
    ]});

    await db.$transaction([users, films]);
    await db.$disconnect();
}

export async function clear() {
    const deleteUsers = db.user.deleteMany();
    const deleteFilms = db.film.deleteMany();
    await db.$transaction([deleteUsers, deleteFilms]);
    await db.$disconnect();
}
