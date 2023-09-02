import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import  {Story}  from "../Objects/Story.new.mjs";
chai.use(chaiAsPromised)
describe("testing Story object", function () {
    const goodData = {
        title: "#teststory",
        word_count:555
    }
    describe("testing create method", function () {
        afterEach(async function () {
            await db('stories')
                .where('title', '#teststory')
                .del()
        })
        it("should return a number when passed good Data", async function () {
            const res = await new Story(goodData).create(db)
            expect(res).to.be.a('number')
        })
        it("should throw when passed bad title", async function () {
            const badData = { ...goodData, title: 1 }
            expect(function () { new Story(badData) }).to.throw(TypeError)
        })
        it("should throw when passed bad wordcount", async function () {
            const badData = { ...goodData, word_count: "str" }
            expect(function () { new Story(badData) }).to.throw(TypeError)
        })
        
    })
    describe("testing delete method", async function () {
        let id = null
        beforeEach(async function () {
            id = await db('stories')
                .insert(goodData)
                .returning('id')
            id = id[0].id
        })
        after(async function (){
            await db('stories')
            .where('title','#teststory')
            .del()
        })
        it("should successfuly delete when given a valid id ", async function (){
            let pub =  new Story(goodData)
            pub.id=id
            await pub.del(db)
            const res = await db('stories').select('*').where('id',id)
            expect(res.length).to.equal(0)
        })
        it("should throw if not given an id", async function (){
            let pub =  new Story(goodData)
            return expect(pub.del(db)).to.be.rejectedWith(Error)
        })
    })
    describe("testing edit method", async function(){
        let id = null
        beforeEach(async function(){
            id = await db('stories')
            .insert(goodData)
            .returning('id')
            id = id[0].id
        })
        afterEach(async function(){
            await db('stories')
            .where('title','#teststory')
        })
        it("it should return true if passed good data", function () {
            const pub = new Story({...goodData,id})
            return expect(pub.edit(db)).to.eventually.equal(true)
        })
        it("should throw if not given id", function(){
            const pub = new Story(goodData)
            return expect(pub.edit(db)).to.be.rejectedWith(Error)
        })
    })
})