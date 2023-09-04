import Entity  from "./Entity.mjs"
import express from "express";
import logger from "../logger.mjs";

export default class Submission extends Entity {
    constructor(data) {
        super(data)
        if (data?.story_id) {
            if (this.isNumber(data.story_id)) {
                this.story_id = data.story_id
            } else { throw new TypeError("story_id must be a number!") }
        }
        if (data?.pub_id) {
            if (this.isNumber(data.pub_id)) {
                this.pub_id = data.pub_id
            } else { throw new TypeError("pub_id must be a number!") }
        }
        if (data?.date_submitted) {
            if (this.dateStringIsValid(data.date_submitted)) {
                this.date_submitted = data.date_submitted
            } else { throw new TypeError("date_submitted must be a valid date!") }
        }
        if (data?.date_responded) {
            if (this.dateStringIsValid(data.date_responded)) {
                this.date_responded = data.date_responded
            } else { throw new TypeError("date_responded must be a valid date!") }
        }
        if (data?.response_id) {
            if (this.isNumber(data.response_id)) {
                this.response_id = data.response_id
            } else {throw new TypeError("response_id must be a number!")}
        }
    }
    get table() {
        return 'subs'
    }
    static endpoints(db) {
        const router = express.Router()
        router.post('/submission/edit', async (req, res) => {
            logger.trace({ data: req.body }, '/submission/edit')
            this.endpoint(db, () => { return new Submission(req.body) }, 'edit', res)
        })
        router.post('/submission/create', async (req, res) => {
            logger.trace({ data: req.body }, '/submission/create')
            this.endpoint(db, () => { return new Submission(req.body) }, 'create', res)
        })
        router.delete('/submission/delete', async (req, res) => {
            logger.trace({ data: req.body }, '/submission/delete')
            this.endpoint(db, () => { return new Submission(req.body) }, 'del', res)
        })
        return router
    }
}