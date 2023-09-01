import { testDb as db } from "../db.mjs";
import { expect } from "chai";
import { describe } from "mocha";
import deleteFromDB from "../deleteFromDB.mjs";

describe("Testing delete calls..",()=>{
    describe("testing deleteFromDB",async ()=>{
        it("it should delete from 'stories' when passed an id that exists", async ()=>{
            const id = await db('stories')
            .insert({title:'Test',word_count:0})
            .returning('id')
            console.log("id:"+id)
            const res = await deleteFromDB(db,'stories',id[0].id)
            expect(res).to.equal(1)
            
        })
        it("it should return 0 when passed an id that doesn't exist", async ()=>{
            const res = await deleteFromDB(db,'stories',9999999999999)
            expect(res).to.equal(0)
            
        })
    })
})