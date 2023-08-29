import { expect } from "chai";
import { describe } from "mocha";
import { keyExists, valueIsNumber, dateStringIsValid } from "../dataValidation.mjs";
const data = {date_responded:"2023-08-21",
date_submitted: "2023-08-11",
id: 6,
pub_id: 14,
response_id: 1,
story_id: 1}
describe("Testing data validation functions...", ()=>{
    describe('Testing keyExists', ()=>{
        it("should return true when passed a valid object/key pair", (done)=>{
            expect(keyExists({apple:1},'apple')).to.equal(true)
            expect(keyExists(data,'id')).to.equal(true)
            expect(keyExists(data,'pub_id')).to.equal(true)
            expect(keyExists(data,'story_id')).to.equal(true)
            done()
        })
        it("should throw an error when passed an invalid object/key pair", (done)=>{
            expect(()=>{keyExists({apple:1},'banana')}).to.throw('missing key')
            done()
        })
    })
    describe('Testing valueIsNumber', ()=>{
        it("should return true when passed a valid object/key pair", (done)=>{
            expect(valueIsNumber({apple:1},'apple')).to.equal(true)
            done()
        })
        it("should throw an error when passed an invalid object/key pair", (done)=>{
            expect(()=>{valueIsNumber({apple:[]},'apple')}).to.throw('not a number')
            done()
        })
    })
    describe('Testing dateStringIsValid', ()=>{
        it("should return true when passed a valid date string", (done)=>{
            expect(dateStringIsValid('2023-06-04')).to.equal(true)
            done()
        })
        it("should throw an error when passed an invalid date", (done)=>{
            expect(()=>{dateStringIsValid('01-01-1999')}).to.throw('date invalid')
            done()
        })
    
    })
})

