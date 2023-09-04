import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import  Publication  from "../Objects/Publication.mjs";
import chaiHttp from "chai-http";
import express from "express";
import bodyParser from "body-parser";
chai.use(chaiAsPromised)
chai.use(chaiHttp)

const app = express()
app.use(bodyParser.json())
app.use('/api', Publication.endpoints(db))

let original = null
describe("testing Publication endpoints", function () {
    describe("/edit", function () {
        beforeEach(async function () {
            original = await db('pubs')
                .select('*')
                .where('id', 1)
            original = original[0]
        })
        afterEach(async function () {
            await db('pubs')
                .where('id', 1)
                .update(original)
        })
        const goodData = {
            id: 1,
            title: '#testtitle',
            link: '#testlink',
            query_after_days: 90
        }
        it("should return 200 when sent a valid request", async function () {
            const res = await chai.request(app)
                .post('/api/publication/edit')
                .send(goodData)
            expect(res).to.have.status(200)
        })
        it("the database should have been updated", async function () {
            await chai.request(app)
                .post('/api/publication/edit')
                .send(goodData)
            const res = await db('pubs')
                .select('*')
                .where('id', 1)
            expect(res[0]).to.eql(goodData)
        })
        it("should return 400 when sent a bad title", async function () {
            const badData = { ...goodData, title: 1 }
            const res = await chai.request(app)
                .post('/api/publication/edit')
                .send(badData)
            expect(res).to.have.status(400)
        })
        it("should return 400 when sent a bad link", async function () {
            const badData = { ...goodData, link: 1 }
            const res = await chai.request(app)
                .post('/api/publication/edit')
                .send(badData)
            expect(res).to.have.status(400)
        })
        it("should return 400 when sent a bad query_after_days", async function () {
            const badData = { ...goodData, query_after_days: "uhoh" }
            const res = await chai.request(app)
                .post('/api/publication/edit')
                .send(badData)
            expect(res).to.have.status(400)
        })
    })
    
    describe("/create", function () {
        afterEach(async function () {
            await db('pubs')
                .where('title', '#testtitle')
                .del()
        })
        const goodData = {
            title: '#testtitle',
            link: '#testlink',
            query_after_days: 90
        }
        it("should return 200 when sent a valid request", async function () {
            const res = await chai.request(app)
                .post('/api/publication/create')
                .send(goodData)
            expect(res).to.have.status(200)
        })
        it("the database should have been updated", async function () {
            await chai.request(app)
                .post('/api/publication/create')
                .send(goodData)
            const res = await db('pubs')
                .select('*')
                .where('title', '#testtitle')
                delete res[0].id
            expect(res[0]).to.eql(goodData)
        })
        it("should return 400 when sent a bad title", async function () {
            const badData = { ...goodData, title: 1 }
            const res = await chai.request(app)
                .post('/api/publication/create')
                .send(badData)
            expect(res).to.have.status(400)
        })
        it("should return 400 when sent a bad link", async function () {
            const badData = { ...goodData, link: 1 }
            const res = await chai.request(app)
                .post('/api/publication/create')
                .send(badData)
            expect(res).to.have.status(400)
        })
        it("should return 400 when sent a bad query_after_days", async function () {
            const badData = { ...goodData, query_after_days: "uhoh" }
            const res = await chai.request(app)
                .post('/api/publication/create')
                .send(badData)
            expect(res).to.have.status(400)
        })
    })
    describe("/delete", function(){
        let id = null
        beforeEach(async function(){
            id = await db('pubs')
            .insert({
                title: '#testtitle',
                link: '#testlink',
                query_after_days: 90
            })
            .returning('id')
            id=id[0]
         
        })
        it("should return 200 if given a valid request", async function(){
            const res = await chai.request(app)
            .delete('/api/publication/delete')
            .send(id)
            expect(res).to.have.status(200)
        })
    })
})