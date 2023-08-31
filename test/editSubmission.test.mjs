import { expect } from "chai";
import { describe } from "mocha";
import { testDb as db } from "../db.mjs";
import { editSubmission } from "../apiObjects/Submission.mjs";

const goodData = {
    id: 10,
    story_id: 2,
    pub_id: 8,
    date_submitted: '2023-03-06',
    date_responded: '2023-06-04',
    response_id: 1
}
const goodData2 = {
    id: 10,
    story_id: 1,
    pub_id: 7,
    date_submitted: '2023-01-06',
    date_responded: '2023-01-04',
    response_id: 2
}

describe("testing editSubmission()", async ()=>{
    it("should return true when passed good data", async ()=>{
        const res = await editSubmission(db,goodData)
        expect(res)
    })
    it("db should have updated", async ()=>{
        const res = await db('subs').select('*').where('id',goodData.id)
        const isEqual = Object.keys(res[0]).every(key=>{
            return goodData[key] === res[0][key]
        })
        expect(isEqual)
    })
    it("should return true when passed good data 2", async ()=>{
        const res = await editSubmission(db,goodData2)
        expect(res)
    })
    it("db should have updated", async ()=>{
        const res = await db('subs').select('*').where('id',goodData2.id)
        const isEqual = Object.keys(res[0]).every(key=>{
            return goodData2[key] === res[0][key]
        })
        expect(isEqual)
    })
})