const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const initial = require('../src/database/initialRoles')
const app = require('../app')
const request = require('supertest')
//const mongoServer = new MongoMemoryServer();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
const opts = {useNewUrlParser: true}; // remove this option if you use mongoose 5 and above

beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts, (err) => {
        if (err) console.error(err);
        initial()
        console.log('test db started')
    });

});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});


describe('authentication', () => {
    test('successful registration (200)', async () => {
        await request(app)
            .post("/api/auth/signup")
            .send({
                username: "yaroslav",
                email: "email@email.ru",
                password: "password"
            })
            .expect(200)
    });
    test('successful login (200)', async () => {
        await request(app)
            .post("/api/auth/signin")
            .send({
                username: "yaroslav",
                email: "email@email.ru",
                password: "password"
            })
            .expect(200)
    });

    test('create product (200)', async () => {
        await request(app)
            .post("/api/products/add")
            .send({
                name: "TestProduct",
                price: 10000,
                stockBalance: 30
            })
            .expect(201)
    })

    test('find one product (200)', async () => {
        const product = await request(app)
            .get("/api/products/find/TestProduct")
            .expect(200)
    })

    test('update product (200)', async () => {
        await request(app)
            .post("/api/products/update/TestProduct")
            .send({
                name: "UpdatedTestName",
                price: 213,
                stockBalance: 333
            })
            .expect(200)
    })

    test('get with conditionals (200)', async () => {
        await request(app)
            .get("/api/products/get-with-conditionals?name=UpdatedTestName&price=250")
            .expect(200)
    })

    test('get products with pagination (200)', async () => {
        await request(app)
            .get("/api/products")
            .expect(200)
    })

    test('delete product (200)', async () => {
        await request(app)
            .post("/api/products/delete/UpdatedTestName")
            .expect(200)
    })
});