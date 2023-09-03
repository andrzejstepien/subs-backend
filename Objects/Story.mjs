import { Entity } from "./Entity.mjs"
import express from "express";
import logger from "../logger.mjs";

export class Story extends Entity {
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