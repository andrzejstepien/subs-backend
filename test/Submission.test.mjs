import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import { Submission } from "../Objects/Submission.mjs";
chai.use(chaiAsPromised)
describe("testing Submission object", function () {
    const goodData = {
        story_id:1,
        pub_id:1,
        date_submitted:"1999-01-01",
        date_responded:"1999-01-02",
        response_id:1
    }
    describe("testing create method", function () {
        afterEach(async function () {
            await db('subs')
                .where('date_submitted', goodData.date_submitted)
                .del()
        })
        it("should return a number when passed good Data", async function () {
            const res = await new Submission(goodData).create(db)
            expect(res).to.be.a('number')
        })
        it("should throw when passed bad story_id", async function () {
            const badData = { ...goodData, story_id: "uhoh" }
            expect(function () { new Submission(badData) }).to.throw(TypeError)
        })
        it("should throw when passed bad pub_id", async function () {
            const badData = { ...goodData, pub_id: [] }
            expect(function () { new Submission(badData) }).to.throw(TypeError)
        })
        it("should throw when passed bad response_id", async function () {
            const badData = { ...goodData, response_id: "not a number" }
            expect(function () { new Submission(badData) }).to.throw(TypeError)
        })
    })
    describe("testing delete method", async function () {
        let id = null
        beforeEach(async function () {
            id = await db('subs')
                .insert(goodData)
                .returning('id')
            id = id[0].id
        })
        after(async function (){
            await db('subs')
            .where('date_submitted',goodData.date_submitted)
            .del()
        })
        it("should successfuly delete when given a valid id ", async function (){
            let pub =  new Submission(goodData)
            pub.id=id
            await pub.del(db)
            const res = await db('subs').select('*').where('id',id)
            expect(res.length).to.equal(0)
        })
        it("should throw if not given an id", async function (){
            let pub =  new Submission(goodData)
            return expect(pub.del(db)).to.be.rejectedWith(Error)
        })
    })
    describe("testing edit method", async function(){
        let id = null
        beforeEach(async function(){
            id = await db('subs')
            .insert(goodData)
            .returning('id')
            id = id[0].id
        })
        afterEach(async function(){
            await db('subs')
            .where('date_submitted',goodData.date_submitted)
        })
        it("it should return true if passed good data", function () {
            const pub = new Submission({...goodData,id})
            return expect(pub.edit(db)).to.eventually.equal(true)
        })
        it("should throw if not given id", function(){
            const pub = new Submission(goodData)
            return expect(pub.edit(db)).to.be.rejectedWith(Error)
        })
    })
})