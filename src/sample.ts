// import { availableParallelism } from 'node:os';
// import cluster from 'node:cluster';
// import process from 'node:process';
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createServer } from 'http';
// import { getUsers } from './controllers/getUserList.js';
// import { getUserById } from './controllers/getUserById.js';
// import { createUser } from './controllers/createUser.js';
// import { updateUser } from './controllers/updateUser.js';
// import { deleteUser } from './controllers/deleteUser.js'
// import dotenv from 'dotenv';
// dotenv.config();

// const numCPUs = availableParallelism();
// const PORT = process.env.PORT || '9000'

// if (cluster.isPrimary) {
//     const startPort = PORT
//     const workers: any[] = [];
//     let nextPortIndex = 0;

//     const getnextPortIndex = () => {
//         nextPortIndex = (nextPortIndex % numCPUs) + 1;
//         return nextPortIndex;
//     };

//     const sendToAllWorkers = (msg: any) => {
//         workers.forEach((worker) => {
//             worker.send(msg);
//         });
//     };
//     console.log(`Master ${process.pid} is running`);

//     for (let i = 1; i <= numCPUs; i++) {
//         const workerPort = Number(startPort) + i;

//         const worker = cluster.fork({ workerPort: workerPort.toString() });
//         worker.on("message", (msg) => {
//             sendToAllWorkers(msg);
//         });

//         workers.push(worker);
//     }

//     const serv = createServer((req, res) => {
//         const workerIndex = getnextPortIndex();
//         handleBalancerRequest(req, res, startPort, workerIndex);
//     });

//     serv.listen(+startPort + nextPortIndex, () => {
//         // console.log(workers[nextPortIndex]);
//         console.log(
//             `${process.pid} is running on the ${+startPort + nextPortIndex} port`
//         );
//     });

// } else if (cluster.isWorker) {
//     const port = process.env["workerPort"];

//     process.on("message", (users) => {
//         console.log(users);
//     });

//     createServer(async (req: any, res: any) => {
//         if (req.url === '/api/users' && req.method === 'GET') {
//             await getUsers(req, res)
//         } else if (req.url.match(/\/api\/users\/[a-f0-9-]/) && req.method === 'GET') {

//             const id = req.url.split('/')[3]
//             await getUserById(req, res, id)

//         } else if (req.url === '/api/users' && req.method === 'POST') {

//             await createUser(req, res)

//         } else if (req.url.match(/\/api\/users\/[a-f0-9-]/) && req.method === 'PUT') {

//             const id = req.url.split('/')[3];
//             await updateUser(req, res, id)

//         } else if (req.url.match(/\/api\/users\/[a-f0-9-]/) && req.method === 'DELETE') {

//             const id = req.url.split('/')[3];
//             await deleteUser(req, res, id)

//         } else if (!req.url.match(/\/api\/users\//)) {
//             res.writeHead(404, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ message: "There is no such endpoint" }))
//         } else {
//             res.writeHead(500, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ message: "Internal Server Error" }))
//         }
//     })
//         .listen(port);
// }


