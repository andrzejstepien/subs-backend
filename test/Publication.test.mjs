import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import { Publication } from "../Objects/Publication.mjs";
chai.use(chaiAsPromised)
describe("testing Publication object", function () {
    const goodData = {
        title: "#testpub",
        link: "www.theinternet.com",
        query_after_days: 66
    }
    describe("testing create method", function () {
        afterEach(async function () {
            await db('pubs')
                .where('title', '#testpub')
                .del()
        })
        it("should return a number when passed good Data", async function () {
            const res = await new Publication(goodData).create(db)
            expect(res).to.be.a('number')
        })
        it("should throw when passed bad title", async function () {
            const badData = { ...goodData, title: 1 }
            expect(function () { new Publication(badData) }).to.throw(TypeError)
        })
        it("should throw when passed bad link", async function () {
            const badData = { ...goodData, link: [] }
            expect(function () { new Publication(badData) }).to.throw(TypeError)
        })
        it("should throw when passed bad query_after_days", async function () {
            const badData = { ...goodData, query_after_days: "not a number" }
            expect(function () { new Publication(badData) }).to.throw(TypeError)
        })
    })
    describe("testing delete method", async function () {
        let id = null
        beforeEach(async function () {
            id = await db('pubs')
                .insert(goodData)
                .returning('id')
            id = id[0].id
        })
        after(async function (){
            await db('pubs')
            .where('title','#testpub')
            .del()
        })
        it("should successfuly delete when given a valid id ", async function (){
            let pub =  new Publication(goodData)
            pub.id=id
            await pub.del(db)
            const res = await db('pubs').select('*').where('id',id)
            expect(res.length).to.equal(0)
        })
        it("should throw if not given an id", async function (){
            let pub =  new Publication(goodData)
            return expect(pub.del(db)).to.be.rejectedWith(Error)
        })
    })
    describe("testing edit method", async function(){
        let id = null
        beforeEach(async function(){
            id = await db('pubs')
            .insert(goodData)
            .returning('id')
            id = id[0].id
        })
        afterEach(async function(){
            await db('pubs')
            .where('title','#testpub')
        })
        it("it should return true if passed good data", function () {
            const pub = new Publication({...goodData,id})
            return expect(pub.edit(db)).to.eventually.equal(true)
        })
        it("should throw if not given id", function(){
            const pub = new Publication(goodData)
            return expect(pub.edit(db)).to.be.rejectedWith(Error)
        })
    })
})