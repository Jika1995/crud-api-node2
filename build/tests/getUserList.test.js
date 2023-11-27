import supertest from 'supertest';
import { server } from 'main.ts';
const requestWithSupertest = supertest(server);
afterEach(done => {
    server.close();
    done();
});
test("GET /users", async () => {
    const response = await requestWithSupertest.get('/api/users');
    expect(response.status).toEqual(200);
    expect(res.body).toEqual([]);
});
//# sourceMappingURL=getUserList.test.js.map