import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import process from 'node:process';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer } from 'http';
import { getUsers } from './controllers/getUserList.js';
import { getUserById } from './controllers/getUserById.js';
import { createUser } from './controllers/createUser.js';
import { updateUser } from './controllers/updateUser.js';
import { deleteUser } from './controllers/deleteUser.js'
import dotenv from 'dotenv';
import { LBRequestHandler, registerWorkers } from './utils/utils.js';
dotenv.config();

const port = Number(process.env.PORT)

if (cluster.isPrimary) {
    const numCPUs = availableParallelism()
    registerWorkers(cluster, port, numCPUs)

    const server = createServer()
    server.listen(port, () => {
        console.log(`Load balancer is running at http://localhost:${port}`)
    })

    let currentPort = port + 1

    server.on("request", async (req, res) => {
        LBRequestHandler(req, res, currentPort)
        currentPort = currentPort === port + (numCPUs - 1) ? port + 1 : currentPort + 1
    })
} else {
    // Worker
    const workerPort = process.env.workerPort
    const server = createServer(async (req: any, res: any) => {
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
    server.listen(workerPort, () => {
        console.log(`Server is running at http://localhost:${workerPort}`)
    })

}