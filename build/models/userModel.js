import { v4 } from 'uuid';
import { writeDataToFile, readDataFromFile } from '../utils/utils.js';
export const findAll = () => {
    return new Promise(async (resolve, _reject) => {
        const users = await readDataFromFile('./src/data/users.json');
        resolve(users);
    });
};
export const findById = (userId) => {
    return new Promise(async (resolve, reject) => {
        const users = await readDataFromFile('./src/data/users.json');
        const user = users.find((u) => u.id === userId);
        if (user) {
            resolve(user);
        }
        else {
            reject(new Error('User not found'));
        }
    });
};
export const create = (user) => {
    const newUser = {
        id: v4(),
        ...user
    };
    return new Promise(async (resolve, _reject) => {
        const data = await readDataFromFile('./src/data/users.json');
        let users = [];
        if (data) {
            users = data;
        }
        users.push(newUser);
        await writeDataToFile('./src/data/users.json', users);
        resolve(newUser);
    });
};
export const update = (userId, user) => {
    return new Promise(async (resolve, _reject) => {
        const users = await readDataFromFile('./src/data/users.json');
        const index = users.findIndex((u) => u.id === userId);
        users[index] = { id: userId, ...user };
        await writeDataToFile('./src/data/users.json', users);
        resolve(users[index]);
    });
};
export const remove = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await readDataFromFile('./src/data/users.json');
            await writeDataToFile('./src/data/users.json', users.filter((u) => u.id !== userId));
            resolve();
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
};
//# sourceMappingURL=userModel.js.map