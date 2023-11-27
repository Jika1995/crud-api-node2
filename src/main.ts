/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer } from 'http';
import { getUsers } from './controllers/getUserList.js';
import { getUserById } from './controllers/getUserById.js';
import { createUser } from './controllers/createUser.js';
import { updateUser } from './controllers/updateUser.js';
import { deleteUser } from './controllers/deleteUser.js'
import dotenv from 'dotenv';
dotenv.config();

export const server = createServer(async (req: any, res: any) => {
    if (req.url === '/api/users' && req.method === 'GET') {
        await getUsers(req, res)
    } else if (req.url.match(/\/api\/users\/[a-f0-9-]/) && req.method === 'GET') {

        const id = req.url.split('/')[3]
        await getUserById(req, res, id)

    } else if (req.url === '/api/users' && req.method === 'POST') {

        await createUser(req, res)

    } else if (req.url.match(/\/api\/users\/[a-f0-9-]/) && req.method === 'PUT') {

        const id = req.url.split('/')[3];
        await updateUser(req, res, id)

    } else if (req.url.match(/\/api\/users\/[a-f0-9-]/) && req.method === 'DELETE') {

        const id = req.url.split('/')[3];
        await deleteUser(req, res, id)

    } else if (!req.url.match(/\/api\/users\//)) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "There is no such endpoint" }))
    } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }))
    }
})

const PORT = process.env.PORT || 9000

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

