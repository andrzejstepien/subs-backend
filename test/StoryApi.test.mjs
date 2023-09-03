import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import { Story } from "../Objects/Story.mjs";
import chaiHttp from "chai-http";
import express from "express";
import bodyParser from "body-parser";
chai.use(chaiAsPromised)
chai.use(chaiHttp)

const app = express()
app.use(bodyParser.json())
app.use('/api', Story.endpoints(db))


describe("testing Story endpoints", function () {
    const goodData = {
        title: "#teststory",
        word_count:555,
        id:1
    }
    let original = null
    describe("/edit", function () {
        beforeEach(async function () {
             original = await db('stories')
                .select('*')
                .where('id', 1)
            original = original[0]
        })
        afterEach(async function () {
            await db('stories')
                .where('id', 1)
                .update(original)
        })
        
        it("should return 200 when sent a valid request", async function () {
            const res = await chai.request(app)
                .post('/api/story/edit')
                .send(goodData)
            expect(res).to.have.status(200)
        })
        it("the database should have been updated", async function () {
            await chai.request(app)
                .post('/api/story/edit')
                .send(goodData)
            const res = await db('stories')
                .select('*')
                .where('id', 1)
            expect(res[0]).to.eql(goodData)
        })
        it("should return 400 when sent a bad title", async function () {
            const badData = { ...goodData, title: 1 }
            const res = await chai.request(app)
                .post('/api/story/edit')
                .send(badData)
            expect(res).to.have.status(400)
        })
        it("should return 400 when sent a bad word_count", async function () {
            const badData = { ...goodData, word_count: "uhoh" }
            const res = await chai.request(app)
                .post('/api/story/edit')
                .send(badData)
            expect(res).to.have.status(400)
        })
    })
    
    describe("/create", function () {
        const goodData = {
            title: "#teststory",
        word_count:555,
        }
        afterEach(async function () {
            await db('stories')
                .where('title', '#testtitle')
                .del()
        })
        it("should return 200 when sent a valid request", async function () {
            const res = await chai.request(app)
                .post('/api/story/create')
                .send(goodData)
            expect(res).to.have.status(200)
        })
        it("the database should have been updated", async function () {
            await chai.request(app)
                .post('/api/story/create')
                .send(goodData)
            const res = await db('stories')
                .select('*')
                .where('title', goodData.title)
                delete res[0].id
            expect(res[0]).to.eql(goodData)
        })
        it("should return 400 when sent a bad title", async function () {
            const badData = { ...goodData, title: 1 }
            const res = await chai.request(app)
                .post('/api/story/create')
                .send(badData)
            expect(res).to.have.status(400)
        })
        it("should return 400 when sent a bad word:count", async function () {
            const badData = { ...goodData, word_count: "uhoh" }
            const res = await chai.request(app)
                .post('/api/story/create')
                .send(badData)
            expect(res).to.have.status(400)
        })
    })
    describe("/delete", function(){
        let id = null
        beforeEach(async function(){
            id = await db('stories')
            .insert({
                title: '#testtitle',
                word_count:66
            })
            .returning('id')
            id=id[0]
        })
        it("should return 200 if given a valid request", async function(){
            const res = await chai.request(app)
            .delete('/api/story/delete')
            .send(id)
            expect(res).to.have.status(200)
        })
    })
})