import { expect } from "chai";
import { describe } from "mocha";
import {db} from "../db.mjs"
import { selectCleanArray, selectStoryGenres, selectAllStoryGenres, getStoryId } from "../selectCalls.mjs";
import { getArrayDepth } from "./testingHelperFunctions.mjs";
import logger from "../logger.mjs";

describe('Testing select calls...', function () {


    describe('Testing selectCleanArray()', function () {
        it("returns an array", async function(){
            const res = await selectCleanArray(db,'stories')
            expect(res).to.be.a('array')
        })
        it("array is depth 1", async function(){
            let res = await selectCleanArray(db,'stories')
            res = getArrayDepth(res)
            expect(res).to.equal(1)
        })
    })


    describe('Testing selectStoryGenres()', function () {
        it("returns an array", async function(){
            const res = await selectStoryGenres(db,'Drag')
            expect(res).to.be.a('array')
        })
        it("array is depth 1", async function(){
            let res = await selectStoryGenres(db,'Drag')
            res = getArrayDepth(res)
            expect(res).to.equal(1)
        })
        it("returns an array of length three when passed 'Elfen Zombie Spaceman in Space' ", async function(){
            let res = await selectStoryGenres(db,'Elfen Zombie Spaceman in Space')
            expect(res.length).to.equal(3)
        })
    })


    describe('Testing selectAllStoryGenres()', function () {
        it("returns an object", async function(){
            const res = await selectAllStoryGenres(db)
            expect(res).to.be.a('object')
        })
        it("every value of object is an array", async function(){
            let res = await selectAllStoryGenres(db)
            res = Object.values(res).every(e=>{return Array.isArray(e)})
            expect(res).to.equal(true)
        })
        it("every value of object is an array of depth 1", async function(){
            let res = await selectAllStoryGenres(db)
            logger.info({res})
            res = Object.values(res).every(e=>{
                return Array.isArray(e) ? getArrayDepth(e)===1 : false
            })
            expect(res).to.equal(true)
        })


        describe('Testing getStoryId()', function () {
            it("returns a number if title is recognised", async function(){
                const res = await getStoryId(db,'Drag')
                expect(res).to.be.a('number')
            })
            it("throws error if title not recognised", async function(){
                expect(await getStoryId(db,'fdhasiufhaediuh')).to.Throw          
            })
        })



    })






})