/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, writeFileSync } from 'fs';
import { User } from './types.js';

export const writeDataToFile = (filename: string, content: User[] | []) => {

    try {
        writeFileSync(filename, JSON.stringify(content), 'utf8')
    } catch (err) {
        console.log(err);
    }
}

export const readDataFromFile = (filename: string): User[] | [] => {
    try {
        const data = readFileSync(filename, 'utf8');
        return JSON.parse(data)
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getPostData = (req: any) => {
    return new Promise<string>((resolve, reject) => {
        try {
            let body = "";
            req.on('data', (chunk: any) => {
                body += chunk.toString()
            })

            req.on('end', () => {
                resolve(body)
            })
        } catch (err) {
            reject(err)
        }
    })
};

