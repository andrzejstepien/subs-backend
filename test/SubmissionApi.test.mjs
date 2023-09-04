import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import Submission from "../Objects/Submission.mjs";
import chaiHttp from "chai-http";
import express from "express";
import bodyParser from "body-parser";
chai.use(chaiAsPromised)
chai.use(chaiHttp)

const app = express()
app.use(bodyParser.json())
app.use('/api', Submission.endpoints(db))


describe("testing Submission endpoints", function () {
    const goodData = {
        id:1,
        story_id:1,
        pub_id:1,
        date_submitted:"1999-01-01",
        date_responded:"1999-01-02",
        response_id:1
    }
    let original = null
    describe("/edit", function () {
        beforeEach(async function () {
             original = await db('subs')
                .select('*')
                .where('id', 1)
            original = original[0]
        })
        afterEach(async function () {
            await db('subs')
                .where('id', 1)
                .update(original)
        })
        
        it("should return 200 when sent a valid request", async function () {
            const res = await chai.request(app)
                .post('/api/submission/edit')
                .send(goodData)
            expect(res).to.have.status(200)
        })
        it("the database should have been updated", async function () {
            await chai.request(app)
                .post('/api/submission/edit')
                .send(goodData)
            const res = await db('subs')
                .select('*')
                .where('id', 1)
            expect(res[0]).to.eql(goodData)
        })
        it("should return 400 when sent a story_id", async function () {
            const badData = { ...goodData, story_id: "uhoh" }
            const res = await chai.request(app)
                .post('/api/submission/edit')
                .send(badData)
            expect(res).to.have.status(400)
        })
        it("should return 400 when sent a pub_id", async function () {
            const badData = { ...goodData, pub_id: "uhoh" }
            const res = await chai.request(app)
                .post('/api/submission/edit')
                .send(badData)
            expect(res).to.have.status(400)
        })
    })
    
    describe("/create", function () {
        const goodData = {
            story_id:1,
            pub_id:1,
            date_submitted:"1999-01-01",
            date_responded:"1999-01-02",
            response_id:1
        }
        afterEach(async function () {
            await db('subs')
                .where('date_submitted', goodData.date_submitted)
                .del()
        })
        it("should return 200 when sent a valid request", async function () {
            const res = await chai.request(app)
                .post('/api/submission/create')
                .send(goodData)
            expect(res).to.have.status(200)
        })
        it("the database should have been updated", async function () {
            await chai.request(app)
                .post('/api/submission/create')
                .send(goodData)
            const res = await db('subs')
                .select('*')
                .where('date_submitted', goodData.date_submitted)
                delete res[0].id
            expect(res[0]).to.eql(goodData)
        })
        it("should return 400 when sent a bad date_responded", async function () {
            const badData = { ...goodData, date_responded: "01-01-1999" }
            const res = await chai.request(app)
                .post('/api/submission/create')
                .send(badData)
            expect(res).to.have.status(400)
        })
        it("should return 400 when sent a bad date_submitted", async function () {
            const badData = { ...goodData, date_submitted: "uhoh" }
            const res = await chai.request(app)
                .post('/api/submission/create')
                .send(badData)
            expect(res).to.have.status(400)
        })
    })
    describe("/delete", function(){
        let id = null
        beforeEach(async function(){
            id = await db('subs')
            .insert({
            story_id:1,
            pub_id:1,
            date_submitted:"1999-01-01",
            date_responded:"1999-01-02",
            response_id:1
            })
            .returning('id')
            id=id[0]
        })
        it("should return 200 if given a valid request", async function(){
            const res = await chai.request(app)
            .delete('/api/submission/delete')
            .send(id)
            expect(res).to.have.status(200)
        })
    })
})