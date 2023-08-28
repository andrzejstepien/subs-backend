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
                    expect(res.body.every(e=>{return typeof e === 'string'}))
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
                    expect(res.body.every(e=>{return e.Title})).to.equal(true)
                })
        })
        
        it('each array item should have a .Genres key and it should yield an array', () => {
            chai.request(server)
                .get('/api/page/stories')
                .end((err, res) => {
                    expect(res.body.every(e=>{return Array.isArray(e.Genres)})).to.equal(true)
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
                    expect(res.body.every(e=>{return e.Title})).to.equal(true)
                })
        })
        it('each array item should have a .Genres key and it should yield an array', () => {
            chai.request(server)
                .get('/api/page/pubs')
                .end((err, res) => {
                    expect(res.body.every(e=>{return Array.isArray(e.Genres)})).to.equal(true)
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
                    expect(res.body.every(e=>e.Story))
                })
        })
        it('each row should have a .Publication', () => {
            chai.request(server)
                .get('/api/stories')
                .end((err, res) => {
                    expect(res.body.every(e=>e.Story))
                })
        })
        it('each row should jave a [Query After]', () => {
            chai.request(server)
                .get('/api/stories')
                .end((err, res) => {
                    expect(res.body.every(e=>e['Query After']))
                })
        })
    })
    describe("GET formOptions", () => {
        it('formOptions should return an object', ()=>{
            chai.request(server)
                .get('/api/formOptions')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('object')
                })
        })
        it('formOptions object should have the key .stories, and it should be an array', ()=>{
            chai.request(server)
                .get('/api/formOptions')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body?.stories).to.be.a('array')
                })
        })
    })

})