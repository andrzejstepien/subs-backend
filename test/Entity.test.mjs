import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import { Entity } from "../Objects/Entity.mjs";
import { Story } from "../Objects/Story.mjs";
chai.use(chaiAsPromised)
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
        describe("static genreIdPairs()",async function(){
            it("should return an array when passed a valid Entity",async function(){
                const entity = new Entity(goodData)
                return expect(Entity.genreIds(db,entity)).to.eventually.be.a('array')
            })
            it("should return array of correct ids  when passed a Story with genre data", function(){
                const story = new Story(goodData)
                return expect(Entity.genreIds(db,story)).to.eventually.eql([1,2])
            })
            it("should return false if there is no genre data", function(){
                const entity = new Entity({id:1})
                return expect(Entity.genreIds(db,entity)).to.eventually.equal(false)
            })
        })
    })
})