import { expect } from "chai";
import chai from "chai";
import { describe, afterEach, beforeEach, after } from "mocha";
import { testDb as db } from "../db.mjs";
import Entity  from "../Objects/Entity.mjs";
import Story from '../Objects/Story.mjs'
import Publication from '../Objects/Publication.mjs'
import chaiAsPromised from "chai-as-promised";
import Genres from "../Objects/Genres.mjs";
chai.use(chaiAsPromised)

describe("testing Genres object",function(){
    describe("static init()",async function(){
        it("should return an object",async function(){
            const res = await Genres.init(db)
            expect(res).to.be.a('object')
        })
        it("should have the keys stories_genres,pubs_genres, and genres",async function(){
            const genres = await Genres.init(db)
            const array = ['stories_genres','pubs_genres','genres']
            console.dir(genres)
            expect(Object.keys(genres).every(key=>array.includes(key))).to.equal(true)
        })
        it("genres.idsForStory should return a string of integers",async function(){
            const genres = await Genres.init(db)
            expect(genres.idsForStory(1)).to.be.a('array')
            for (const id of genres.idsForStory(1)) {
                expect(id).to.be.a('number')
            }
        })
        it("genres.idsForPubshould return a string of integers",async function(){
            const genres = await Genres.init(db)
            expect(genres.idsForPub(1)).to.be.a('array')
            for (const id of genres.idsForPub(1)) {
                expect(id).to.be.a('number')
            }
        })
        it(".names() should return an array of strings",async function(){
            const genres = await Genres.init(db) 
            expect(genres.names()).to.be.a('array')
            for (const name of genres.names()) {
                expect(name).to.be.a('string')
            }
        })
        it(".names() should include the string 'horror",async function(){
            const genres = await Genres.init(db) 
            expect(genres.names().includes('horror')).to.equal(true)
        })
        describe("testing delete functions",async function(){
            it("deleteForEntity() should successfully delete all entries when passed a story object",async function(){
                const story = new Story({id:1})
                await db('stories_genres')
            .insert({story_id:1,genre_id:1})
            const genres = await Genres.init(db)
            await genres.deleteForEntity(db,story)
            const res = await db('stories_genres')
            .count('*')
            .where('story_id',1)
            expect(res[0]['count(*)']).to.equal(0)
            })
            it("deleteForEntity() should successfully delete all  entries when a publication object",async function(){
                const pub = new Publication({id:1})
                await db('pubs_genres')
                .insert({pub_id:1,genre_id:1})
                const genres = await Genres.init(db)
                await genres.deleteForEntity(db,pub)
                const res = await db('pubs_genres')
                .count('*')
                .where('pub_id',1)
                expect(res[0]['count(*)']).to.equal(0)
                })
            
        })
        
    })

})