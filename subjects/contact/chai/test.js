const { spawn } = require('child_process');
const { join } = require('path')
const chai = require('chai')
const chaiHttp = require('chai-http');
const chaiArrays = require('chai-arrays');
const chaiThings = require('chai-things');
const witch = require('witch');
const chaiSubset = require('chai-subset');
const ChaiUUID = require('chai-uuid');

chai.use(chaiHttp);
chai.use(chaiArrays);
chai.use(chaiThings);
chai.use(chaiSubset);
chai.use(ChaiUUID);

const projectPath = join(__dirname, '../../../', 'packages/express-middleware')
const scriptPath = join(projectPath, 'server.js');


function wait() {
    return new Promise((resolve) => {
        setTimeout(() => { 
            resolve()
        }, 3000);
    })
}

function startServer() {
    const ps = spawn(
        "/usr/local/bin/node", [`${scriptPath}`],  
        {
            env: {
                ...process.env.PATH,
                BACKEND_PORT: 10201,
                JWT_SECRET: "qwertyuiopasdfghjklzxcvbnm123456",
                NODE_ENV: 'production',
                SUBJECT: process.env.SUBJECT,
                DB_PATH: process.env.DB_PATH
            },
            shell: true
        }
    )

    ps.stdout.setEncoding('utf8');
    ps.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    ps.stderr.setEncoding('utf8');
    ps.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    return ps;
}

const jwt_user1 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6MTAyMDAiLCJpYXQiOjE2MTAwNTYxMDgsImV4cCI6MTgwNTg0MTM3OCwiYXVkIjoibG9jYWxob3N0OjEwMjAwIiwic3ViIjoiMGU3ZGU5YTktN2EyZS00YjVhLWI0MmQtM2RmMmE5YzA0NTVlIn0.h7sEGkSx7z8fsycnBzPMb573UBfzPc4ZvKI7XEWD-Nw'

const jwt_user2 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6MTAyMDAiLCJpYXQiOjE2MTAwNTYxMDgsImV4cCI6MTgwNTg0MTM3OCwiYXVkIjoibG9jYWxob3N0OjEwMjAwIiwic3ViIjoiNDMwMmI5N2YtYjQyOS00NjQ4LThiNTEtNzM2NDVlNmZkMjY5In0.msDNRsVIh6kGfy15-gmd-k58F2QwE-zlXVtMCn7llLU'

const subject = process.env.SUBJECT
const PORT = 10201
const server = `http://localhost:${PORT}`

function request() {
    const r = chai.request(server);
    return r
}

let psServer
describe('API', () => {
    before(function (done) {
        this.timeout(10201)
        psServer = startServer()
        wait().then(() => { 
            done();}
        )
    })

    after(function(done) {
        psServer.kill()
        done()
    });

    describe('Get All', () => {
        it ('it should return 401 without jwt', (done) => {
            request()
                .get(`/${subject}/`).then((res) => {
                    chai.expect(res).to.have.status(401);
                    done()
                }).catch(done)
        })

        it('it should be return 2 elements with user 1', (done) => {
            request()
                .get(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .then((res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body).to.be.array();
                    chai.expect(res.body).to.have.lengthOf(2)
                    chai.expect(res.body).to.containSubset(
                        JSON.parse(`[{"name":"Jack O'Neill","about":"Live in Colorado","type":"work","uuid":"ad1afbd2-77d2-404e-bbca-3f352f7f09a2"},{"name":"Valéry Giscard d'Estaing","about":"greatest president","type":"friend","uuid":"c067b934-d98f-4d0a-a4a3-c89c05a00e4a"}]`)
                    )
                    done()
                }).catch(done)
        })
    })

    describe('Get One', () => {
        it ('it should return 401 without jwt', (done) => {
            request()
                .get(`/${subject}/51a7b6cd-c3d2-4ee0-bf09-9f340e2a156e`).then((res) => {
                    chai.expect(res).to.have.status(401);
                    done()
                }).catch(done)
        })

        it('it should return 404', done => {
            request()
                .get(`/${subject}/51a7b6cd-c3d2-4ee0-bf09-9f340e2a156e`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .then((res) => {
                    chai.expect(res).to.have.status(404);
                    done()
                }).catch(done)
        })

        it('it should be return the element by id', (done) => {
            request()
                .get(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .then((res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body).to.containSubset(
                        JSON.parse(`{"name":"Jack O'Neill","about":"Live in Colorado","type":"work","uuid":"ad1afbd2-77d2-404e-bbca-3f352f7f09a2"}`)
                    )
                    done()
                }).catch(done)
        })


    })

    describe('Post', () => {
        it('it should return 401 without jwt', (done) => {
            request()
                .get(`/${subject}/51a7b6cd-c3d2-4ee0-bf09-9f340e2a156e`).then((res) => {
                    chai.expect(res).to.have.status(401);
                    done()
                }).catch(done)
        })

        it('it should return 422 when name is not defined', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"about":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when name is null', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":null,"about":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when name is empty', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"","about":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when about is not defined', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when about is null', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"about":null,"name":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when about is empty', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"about":"","name":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when type is not defined', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","about":"Yolo"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when type is null', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"type":null,"name":"Yolo","about":"Yolo"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when type is empty', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"type":"","name":"Yolo","about":"Yolo"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when type is an invalid enum', (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"type":"WRONG_ENUM","name":"Yolo","about":"Yolo"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })

        it(`it should return 201 when create a valid ${subject}`, (done) => {
            request()
                .post(`/${subject}/`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","about":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(201);
                    chai.expect(res.body).to.containSubset(
                        JSON.parse(`{"name":"Yolo","about":"Yolo","type":"work"}`)
                    )
                    chai.expect(res.body.uuid).to.be.a.uuid('v4') 
                    done()
                }).catch(done)
        })
    })

    describe('Put', () => {
        it ('it should return 401 without jwt', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`).then((res) => {
                    chai.expect(res).to.have.status(401);
                    done()
                }).catch(done)
        })

        it('it should return 422 when name is not defined', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"about":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when name is null', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":null,"about":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when name is empty', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"","about":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when about is not defined', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when about is null', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","about":null,"type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when about is empty', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","about":"","type":"work"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when type is not defined', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","about":"Yolo"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when type is null', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","about":"Yolo","type":null}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when type is empty', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","about":"Yolo","type":""}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
        it('it should return 422 when type is an invalid enum', (done) => {
            request()
                .put(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .set('Content-type', 'application/json')
                .send('{"name":"Yolo","about":"Yolo","type":"WRONG_ENUM"}')
                .then((res) => {
                    chai.expect(res).to.have.status(422);
                    done()
                }).catch(done)
        })
    })

    describe('Delete', () => {
        it ('it should return 401 without jwt', (done) => {
            request()
                .delete(`/${subject}/51a7b6cd-c3d2-4ee0-bf09-9f340e2a156e`).then((res) => {
                    chai.expect(res).to.have.status(401);
                    done()
                }).catch(done)
        })

        it ('it should be return 404 when iteme to delete doesn\'t exist', (done) => {
            request()
                .delete(`/${subject}/51a7b6cd-c3d2-4ee0-bf09-9f340e2a156e`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .then((res) => {
                    chai.expect(res).to.have.status(404);
                    done()
                })
                .catch(done)
        })

        it ('it should be return 204 when iteme to delete exist', (done) => {
            request()
                .delete(`/${subject}/ad1afbd2-77d2-404e-bbca-3f352f7f09a2`)
                .set('Authorization', `Bearer ${jwt_user1}`)
                .then((res) => {
                    chai.expect(res).to.have.status(204);
                    done()
                })
                .catch(done)
        })

    })
})