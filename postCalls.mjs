import { db } from "./db.mjs";
import logger from "./logger.mjs";



export const newStory = async (data) => {
    logger.trace({ data }, "newStory called!")
    try {
        await db('stories')
            .insert({
                title: data.title,
                word_count: data.word_count
            })
        let story_id =
            await db('stories')
                .select('id')
                .where('title', data.title)
        story_id = story_id[0].id
        logger.info(story_id)
        delete data.title
        delete data.word_count
        const keys = Object.keys(data)
        for (const key of keys) {
            if (data[key]) {
                let genre_id =
                    await db('genres')
                        .select('id')
                        .where('name', key)
                genre_id = genre_id[0].id
                logger.info(genre_id)
                await db('stories_genres')
                    .insert({
                        story_id,
                        genre_id
                    })
            }
        }
    } catch (error) {
        logger.error(error)
    }


}