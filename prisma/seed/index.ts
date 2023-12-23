import {userIds} from './seedIds';
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

export async function clear() {
    const deleteUsers = db.user.deleteMany();
    await db.$transaction([deleteUsers]);
    await db.$disconnect();
}
