import express from "express";
import logger from "../logger.mjs";
import Entity from "./Entity.mjs";
import Genres from "./Genres.mjs";
import Submission from "./Submission.mjs";
export default class Story extends Entity {
    constructor(data) {
        super(data)
        if (data?.word_count) {
            const wordcount = parseInt(data?.word_count)
            if (this.isNumber(wordcount)) {
                this.word_count = wordcount
            } else { throw TypeError("word_count must be a number") }
        }
    }
    get table() {
        return 'stories'
    }

    get singular(){
        return 'story'
    }

    static async getPageData(db) {
        const storiesData = await db('stories')
            .select('id as ID', 'title as Title', 'word_count as Wordcount')
        const genres = Genres.init(db)
        return Promise.all(storiesData.map(async row=>{
            row.Submissions = await Submission.submissionsByEntity(this)
            row.Genres = genres.
        }))
       
    }

    static endpoints(db) {
        const router = express.Router()
        router.post('/story/edit', async (req, res) => {
            logger.trace({ data: req.body }, '/story/edit')
            this.endpoint(db, () => { return new Story(req.body) }, 'edit', res)
        })
        router.post('/story/create', async (req, res) => {
            logger.trace({ data: req.body }, '/story/create')
            this.endpoint(db, () => { return new Story(req.body) }, 'create', res)
        })
        router.delete('/story/delete', async (req, res) => {
            logger.trace({ data: req.body }, '/story/delete')
            this.endpoint(db, () => { return new Story(req.body) }, 'del', res)
        })
        return router
    }
}