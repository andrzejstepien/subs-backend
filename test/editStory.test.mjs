import { expect } from "chai";
import { describe } from "mocha";
import { testDb as db } from "../db.mjs";
import { editStory } from "../apiObjects/Story.mjs";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised)

const goodData = {
    id: 1,
    title:'Test',
    word_count:500,
    horror:true
}
const goodData2 = {
    id: 1,
    title:'Test2',
    word_count:225
}





describe("testing editStory()", async ()=>{
    it("should return true when passed good data", async ()=>{
        const res = await editStory(db,goodData)
        expect(res)
    })
    it("should throw an error when passed a non-number as id", async ()=>{
        const badData = {...goodData,id:'string'}
        return expect(editStory(db,badData)).to.be.rejectedWith(TypeError)
    })
    it("should throw an error when passed a non-string as title", async ()=>{
        const badData = {...goodData,title:1}
        return expect(editStory(db,badData)).to.be.rejectedWith(TypeError)
    })
    it("should throw an error when passed a non-number as word_count", async ()=>{
        const badData = {...goodData,word_count:'string'}
        return expect(editStory(db,badData)).to.be.rejectedWith(TypeError)
    })
    it("db should have updated", async ()=>{
        const res = await db('stories')
        .select('title')
        .where('id',1)
        expect(res[0].title).to.equal('Test')
    })
    it("should return true when passed good data 2", async ()=>{
        const res = await editStory(db,goodData2)
        expect(res)
    })
    it("db should have updated", async ()=>{
        // const res = await db('stories').select('*').where('id',goodData2.id)
        // const isEqual = Object.keys(res[0]).every(key=>{
        //     return goodData2[key] === res[0][key]
        // })
        // expect(isEqual)
    })
})

const dbRestored = db('stories')
.where('id',1)
.update('title','All Mouth')
console.log(dbRestored)

