import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import  Submission  from "../Objects/Submission.mjs";
import Story from "../Objects/Story.mjs";
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
        it("should throw when passed bad sub_id", async function () {
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
            let sub =  new Submission(goodData)
            sub.id=id
            await sub.del(db)
            const res = await db('subs').select('*').where('id',id)
            expect(res.length).to.equal(0)
        })
        it("should throw if not given an id", async function (){
            let sub =  new Submission(goodData)
            return expect(sub.del(db)).to.be.rejectedWith(Error)
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
            const sub = new Submission({...goodData,id})
            return expect(sub.edit(db)).to.eventually.equal(true)
        })
        it("should throw if not given id", function(){
            const sub = new Submission(goodData)
            return expect(sub.edit(db)).to.be.rejectedWith(Error)
        })
    })
    describe("getTable()", function(){
        it("should return an array",async function(){
            const sub = new Submission(goodData)
            const res = await sub.getTable(db)
            expect(res).to.be.a('array')
        })
        it("should return an array of >=5",async function(){
            const sub = new Submission(goodData)
            const res = await sub.getTable(db)
            expect(res.length).to.be.greaterThanOrEqual(5)
        })
        it("each object of the array should have the key .pub_id",async function(){
            const sub = new Submission(goodData)
            const res = await sub.getTable(db)
            expect(
                res.every(e=>{return e?.pub_id})
            ).to.equal(true)
        })
    })
    describe("getColumn()",function(){
        it("should return an array",async function(){
            const sub  = new Submission(goodData)
            const res = await sub.getColumn(db,'story_id')
            expect(res).to.be.a('array')
        })
        it("the story_id array[0] should be a number",async function(){
            const sub = new Submission(goodData)
            const res = await sub.getColumn(db,'story_id')
            expect(res[0]).to.be.a('number')
        })
    })
    describe("submissionsById",async function(){
        it("should return an array of length > 1 when passed a valid story object",async function(){
            
            const res = await Story.view(db)
            expect(res).to.be.a('array')
            expect(res).to.have.lengthOf.greaterThan(1)
        })
    })
})