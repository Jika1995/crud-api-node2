/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, writeFileSync } from 'fs';
import { User } from './types.js';
import { IncomingMessage, request, ServerResponse } from 'http';
import { Cluster, Worker } from "cluster"

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

// export const handleBalancerRequest = (
//     req: IncomingMessage,
//     res: ServerResponse,
//     port: string,
//     workerIndex: number
// ) => {
//     const myRequest = request({
//         host: "localhost",
//         port: (+port) + workerIndex + 1,
//         method: req.method,
//         headers: req.headers,
//         path: req.url,
//     })

//     myRequest.on("response", (myReqRes: IncomingMessage) => {
//         res.writeHead(myReqRes.statusCode!, myReqRes.headers)
//         myReqRes.pipe(res)
//     })

//     req.pipe(myRequest)
// }


export const registerWorkers = (cluster: Cluster, port: number, count: number) => {
    const workers: Worker[] = []

    for (let i = 1; i < count; i++) {
        const worker = cluster.fork({ workerPort: port + i })
        workers.push(worker)
    }

    // Workers broadcasting
    workers.forEach((worker) => {
        worker.on("message", (message: { data: any, type: string }) => {
            for (const otherWorker of workers) {
                if (otherWorker !== worker) {
                    otherWorker.send(message)
                }
            }
        })
    })

    return workers
}

export const sendResponse = (res: ServerResponse, statusCode: number, body: string) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" })
    res.end(body)
}

export const LBRequestHandler = (
    req: IncomingMessage,
    res: ServerResponse,
    port: number,
) => {
    const options = {
        host: "localhost",
        port: port,
        method: req.method,
        headers: req.headers,
        path: req.url,
    }
    const innerReq = request(options, async (innerRes) => {
        const response = await getPostData(innerRes)
        res.writeHead(innerRes.statusCode!, innerRes.headers)
        res.end(response)
    })
    innerReq.on("error", (error) => {
        console.error("Inner Request Error:", error)
        sendResponse(res, 500, "Internal Server Error")
    })
    console.log(`port ${port} handled request ${req.url} ${req.method}`)

    // Send the request body if present
    req.pipe(innerReq)

    // End the request to trigger the inner request
    req.on("end", () => {
        innerReq.end()
    })

}
