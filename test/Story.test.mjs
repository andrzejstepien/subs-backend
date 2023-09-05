import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import  Story  from "../Objects/Story.mjs";
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
        it("should return true when passed a story including genre data",async function(){
            const data = {
                ...goodData,
                genres:{
                    horror:true,
                    fantasy:true,
                    'sci-fi':false
                }}
            const story = new Story(data)
            return expect(story.create(db)).to.eventually.equal(true)
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
            let story =  new Story(goodData)
            story.id=id
            await story.del(db)
            const res = await db('stories').select('*').where('id',id)
            expect(res.length).to.equal(0)
        })
        it("should throw if not given an id", async function (){
            let story =  new Story(goodData)
            return expect(story.del(db)).to.be.rejectedWith(Error)
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
            const story = new Story({...goodData,id})
            return expect(story.edit(db)).to.eventually.equal(true)
        })
        it("should throw if not given id", function(){
            const story = new Story(goodData)
            return expect(story.edit(db)).to.be.rejectedWith(Error)
        })
    })
    describe("table()", function(){
        it("should return an array",async function(){
            const story = new Story(goodData)
            const res = await story.getTable(db)
            expect(res).to.be.a('array')
        })
        it("should return an array of >=5",async function(){
            const story = new Story(goodData)
            const res = await story.getTable(db)
            expect(res.length).to.be.greaterThanOrEqual(5)
        })
        it("each object of the array should have the key .title",async function(){
            const story = new Story(goodData)
            const res = await story.getTable(db)
            expect(
                res.every(e=>{return e?.title})
            ).to.equal(true)
        })
    })
    describe("getColumn()",function(){
        it("should return an array",async function(){
            const story = new Story(goodData)
            const res = await story.getColumn(db,'title')
            expect(res).to.be.a('array')
        })
        it("the titles array[0] should be a strings",async function(){
            const story = new Story(goodData)
            const res = await story.getColumn(db,'title')
            expect(res[0]).to.be.a('string')
        })
    })
    describe("getSubmissions()",async function(){
        it("should return an array", async function(){
            const data = {id:1}
            const story = new Story(data)
            const res = await story.getSubmissions(db)
            expect(res).to.be.a('array')
        })
        it("should throw if no id",async function(){
            const story = new Story(goodData)
            expect(story.getSubmissions()).to.eventually.throw()
        })
    })
    describe("static view()",async function(){
        it("should return an array",async function(){
            const story = new Story({id:1})
            const res = await Story.view(db)
            expect(res).to.be.a('array')
        })
    })
    describe("list()", async function(){
        it("should return an array", async function(){
            const res = await Story.list(db)
            expect(res).to.be.a('array')
        })
    })
})