import { expect } from "chai";
import chai from "chai";
import chaiEach from "chai-each";
import { use } from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import Entity from "../Objects/Entity.mjs";
chai.use(chaiAsPromised)
chai.use(chaiEach)
describe("Entity class",function(){
   const goodData = {
        id:1,
        genres:{
            horror:true,
            fantasy:true,
            'sci-fi':false
        }
    }
    describe("methods",function(){
        describe("get genres",function(){
            it("should return an array of when passed initialised with valid data", function(){
                const entity = new Entity(goodData)
                expect(entity.genres).to.be.a('object')
               
            })
            it("should return false when passed data without genres",function(){
                const entity = new Entity({id:1})
                expect(entity.genres).to.equal(false)
            })
            it("should return the same genre data that was passed to it", function(){
                const entity = new Entity(goodData)
                expect(entity.genres).to.eql(goodData.genres)
            })
            it("should throw when passed genres that is not an object",function(){
                expect(()=>{new Entity({...goodData,genres:"uhoh"})}).to.throw()
            })
            
        })
        describe("table()", function(){
            it("should return an array when passed 'stories' table ref",async function(){
                const entity = new Entity(goodData)
                const res = await entity.getTable(db,'stories')
                expect(res).to.be.a('array')
            })
            it("should return an array of >=5 when passed 'stories' table ref",async function(){
                const entity = new Entity(goodData)
                const res = await entity.getTable(db,'stories')
                expect(res.length).to.be.greaterThanOrEqual(5)
            })
            it("each object of the array should have the key .title",async function(){
                const entity = new Entity(goodData)
                const res = await entity.getTable(db,'stories')
                expect(
                    res.every(e=>{return e?.title})
                ).to.equal(true)
            })
        })
        describe("getColumn()",function(){
            it("should return an array",async function(){
                const entity = new Entity(goodData)
                const res = await entity.getColumn(db,'title','pubs')
                expect(res).to.be.a('array')
            })
            it("the pubs.titles array[0] should be a strings",async function(){
                const entity = new Entity(goodData)
                const res = await entity.getColumn(db,'title','pubs')
                expect(res[0]).to.be.a('string')
            })
        })
        describe("getSubmissions()",async function(){
            it("should return itself", async function(){
                const entity = new Entity(goodData)
                return expect(entity.getSubmissions(db)).to.eventually.equal(entity)
            })
        })
    })
})