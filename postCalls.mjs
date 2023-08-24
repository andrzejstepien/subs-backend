import { db } from "./db.mjs";
import logger from "./logger.mjs";
export const newStory = async (data) => {
    logger.trace({data}, "newStory called!")
    return db('stories')
    .insert(data)
}