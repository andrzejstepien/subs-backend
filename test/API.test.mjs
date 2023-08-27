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



})