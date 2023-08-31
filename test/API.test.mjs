import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import app from '../index.mjs'

const server = app

chai.use(chaiHttp)
describe("Testing API", () => {

    describe('/GET stories', () => {
        it('it should GET all stories', () => {
            chai.request(server)
                .get('/api/stories')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('array')
                    expect(res.body.length).to.equal(14)
                })
        })
        it('each story should be a string', () => {
            chai.request(server)
                .get('/api/stories')
                .end((err, res) => {
                    expect(res.body.every(e => { return typeof e === 'string' }))
                })
        })
    })


    describe("/GET /api/page/stories", () => {
        it('it should GET all story page data', () => {
            chai.request(server)
                .get('/api/page/stories')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('array')
                    expect(res.body.length).to.equal(14)
                })
        })
        it('each array item should be an object with a .Title key', () => {
            chai.request(server)
                .get('/api/page/stories')
                .end((err, res) => {
                    expect(res.body.every(e => { return e.Title })).to.equal(true)
                })
        })

        it('each array item should have a .Genres key and it should yield an array', () => {
            chai.request(server)
                .get('/api/page/stories')
                .end((err, res) => {
                    expect(res.body.every(e => { return Array.isArray(e.Genres) })).to.equal(true)
                })
        })

    })

    describe("/GET /api/page/pubs", () => {
        it('it should GET all pub page data', () => {
            chai.request(server)
                .get('/api/page/pubs')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('array')
                    expect(res.body.length).to.equal(32)
                })
        })
        it('each array item should be an object with a .Title key', () => {
            chai.request(server)
                .get('/api/page/pubs')
                .end((err, res) => {
                    expect(res.body.every(e => { return e.Title })).to.equal(true)
                })
        })
        it('each array item should have a .Genres key and it should yield an array', () => {
            chai.request(server)
                .get('/api/page/pubs')
                .end((err, res) => {
                    expect(res.body.every(e => { return Array.isArray(e.Genres) })).to.equal(true)
                })
        })
    })

    describe('/GET submissions', () => {
        it('it should GET all submissions', () => {
            chai.request(server)
                .get('/api/submissions')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('array')
                    expect(res.body.length).to.equal(50)
                })
        })
        it('each row should jave a .Story', () => {
            chai.request(server)
                .get('/api/stories')
                .end((err, res) => {
                    expect(res.body.every(e => e.Story))
                })
        })
        it('each row should have a .Publication', () => {
            chai.request(server)
                .get('/api/stories')
                .end((err, res) => {
                    expect(res.body.every(e => e.Story))
                })
        })
        it('each row should jave a [Query After]', () => {
            chai.request(server)
                .get('/api/stories')
                .end((err, res) => {
                    expect(res.body.every(e => e['Query After']))
                })
        })
    })
    describe("GET formOptions", () => {
        it('formOptions should return an object', () => {
            chai.request(server)
                .get('/api/formOptions')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('object')
                })
        })
        it('formOptions object should have the key .stories, and it should be an array', () => {
            chai.request(server)
                .get('/api/formOptions')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body?.stories).to.be.a('array')
                })
        })
    })

    describe("GET idsTable", ()=>{
        it('it should return an object', () => {
            chai.request(server)
                .get('/api/idsTable')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('object')
                })
        })
    })

    

    describe("POST submission/edit", () => {
        const goodData = {
            id: 10,
            story_id: 2,
            pub_id: 8,
            date_submitted: '2023-03-06',
            date_responded: '2023-06-04',
            response_id: 1
        }
        describe("Data validation..", () => {
            it("it should return 400 if .id doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.id
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .id isn't a number", () => {
                const badData = {
                    ...goodData,
                    id:"string"
                }
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .story_id doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.story_id
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .story_id isn't a number", () => {
                const badData = {
                    ...goodData,
                    story_id:"string"
                }
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .pub_id doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.pub_id
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .pub_id isn't a number", () => {
                const badData = {
                    ...goodData,
                    pub_id:"string"
                }
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .date_submitted doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.date_submitted
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .date_submitted isn't a valid date", () => {
                const badData = {
                    ...goodData,
                    date_submitted:"string"
                }
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .date_responded doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.date_responded
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .date_responded isn't a valid date", () => {
                const badData = {
                    ...goodData,
                    date_responded:"string"
                }
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .response_id doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.response
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .response_id isn't a number", () => {
                const badData = {
                    ...goodData,
                    response_id:"string"
                }
                chai.request(server)
                    .post('/api/submission/edit', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            

        })
    })

    describe("POST submission/new", ()=>{
        const goodData = {
            id: 10,
            story_id: 2,
            pub_id: 8,
            date_submitted: '2023-03-06',
            date_responded: '2023-06-04',
            response_id: 1
        }
        describe("Data validation..", () => {
            it("it should return 400 if .id doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.id
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .id isn't a number", () => {
                const badData = {
                    ...goodData,
                    id:"string"
                }
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .story_id doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.story_id
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .story_id isn't a number", () => {
                const badData = {
                    ...goodData,
                    story_id:"string"
                }
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .pub_id doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.pub_id
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .pub_id isn't a number", () => {
                const badData = {
                    ...goodData,
                    pub_id:"string"
                }
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .date_submitted doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.date_submitted
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .date_submitted isn't a valid date", () => {
                const badData = {
                    ...goodData,
                    date_submitted:"string"
                }
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .date_responded doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.date_responded
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .date_responded isn't a valid date", () => {
                const badData = {
                    ...goodData,
                    date_responded:"string"
                }
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .response_id doesn't exist", () => {
                const badData = {
                    ...goodData,
                }
                delete badData.response
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            it("it should return 400 if .response_id isn't a number", () => {
                const badData = {
                    ...goodData,
                    response_id:"string"
                }
                chai.request(server)
                    .post('/api/submission/new', badData)
                    .end((err, res) => {
                        expect(res).to.have.status(400)
                    })
            })
            

        })
    })
})