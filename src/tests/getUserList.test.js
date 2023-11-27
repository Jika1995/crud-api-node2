import supertest from 'supertest';
import { server } from 'main.js';

const requestWithSupertest = supertest(server) // We will use this function to mock HTTP requests

afterEach(done => { // afterEach function is provided by Jest and executes once all tests are finished
    server.close() // We close the server connection once all tests have finished
    done()
})

test("GET /users", async () => {
    const response = await requestWithSupertest.get('/api/users')
    expect(response.status).toEqual(200)
    expect(res.body).toEqual([])
})