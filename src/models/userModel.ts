/* eslint-disable @typescript-eslint/no-unused-vars */
// import data from '../data/users.json' assert { type: "json" };
import { v4 } from 'uuid';
import { writeDataToFile, readDataFromFile } from '../utils/utils.js';
import { User } from '../utils/types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const users = (<any>data)

export const findAll = () => {
    return new Promise(async (resolve, _reject) => {
        const users = await readDataFromFile('./src/data/users.json')
        resolve(users)
    })
}

export const findById = (userId: string) => {
    return new Promise<User>(async (resolve, reject) => {
        const users = await readDataFromFile('./src/data/users.json')
        const user = users.find((u: User) => u.id === userId)
        if (user) {
            resolve(user)
        } else {
            reject(new Error('User not found'));
        }
    })
}

export const create = (user: Omit<User, 'id'>) => {
    const newUser = {
        id: v4(),
        ...user
    }

    return new Promise(async (resolve, _reject) => {
        const data = await readDataFromFile('./src/data/users.json')
        let users: User[] = []

        if (data) {
            users = data
        }

        users.push(newUser)
        await writeDataToFile('./src/data/users.json', users);
        resolve(newUser)
    })
}

export const update = (userId: string, user: Omit<User, 'id'>) => {
    return new Promise(async (resolve, _reject) => {
        const users = await readDataFromFile('./src/data/users.json')
        const index = users.findIndex((u: User) => u.id === userId)
        users[index] = { id: userId, ...user }
        await writeDataToFile('./src/data/users.json', users)
        resolve(users[index])
    })
}

export const remove = (userId: string) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const users = await readDataFromFile('./src/data/users.json')
            await writeDataToFile('./src/data/users.json', users.filter((u: User) => u.id !== userId));
            resolve();
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}