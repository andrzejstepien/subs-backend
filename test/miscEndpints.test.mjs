import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import chaiAsPromised from "chai-as-promised";
import  Publication  from "../Objects/Publication.mjs";
import chaiHttp from "chai-http";
import app from "../index.mjs";
chai.use(chaiAsPromised)
chai.use(chaiHttp)
describe("/form-options",async function(){
    it("should return an object",async function(){
        const res = await chai.request(app)
            .get('/api/form-options')
            expect(res.body).to.be.a('object')
    })
    it("the object should have the key 'stories'",async function(){
        const res = await chai.request(app)
            .get('/api/form-options')
            expect(res.body).to.contain.key('stories')
    })
    it("the object should have the key 'publications'",async function(){
        const res = await chai.request(app)
            .get('/api/form-options')
            expect(res.body).to.contain.key('publications')
    })
    it("the object should have the key 'genres'",async function(){
        const res = await chai.request(app)
            .get('/api/form-options')
            expect(res.body).to.contain.key('genres')
    })
})