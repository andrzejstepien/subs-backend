import logger from "../logger.mjs"
import { isNumber,isString } from "../dataValidation.mjs"
import { selectEntityGenres } from "../selectCalls.mjs"


export const newStory = async (db,data) => {
    logger.trace({ data }, "newStory called!")
 
        let story_id = await db('stories')
            .insert({
                title: data.title,
                word_count: data.word_count
            })
            .returning('id')
        
        story_id = story_id[0].id
        logger.trace(story_id)
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
                logger.trace(genre_id)
                await db('stories_genres')
                    .insert({
                        story_id,
                        genre_id
                    })
            }
        }



}

export const editStory = async (db,rawData) => {

        const data = {
            ...rawData,
            id:parseInt(rawData.id),
            word_count:parseInt(rawData.word_count)
        }
        logger.info({ data }, "edit story called!")
        
        isNumber(data.id)
        isNumber(data.word_count)
        isString(data.title)
        const story_id = data.id
        await db('stories')
        .where('id',story_id)
        .update({
            title:data.title,
            word_count:data.word_count
        })
        await db('stories_genres')
        .where('story_id',data.id)
        .delete()
        delete data.title
        delete data.word_count
        delete data.id
        const genres = Object.keys(data)
        for (const key of genres) {
            if (data[key]) {
                let genre_id =
                    await db('genres')
                        .select('id')
                        .where('name', key)
                genre_id = genre_id[0].id
                await db('stories_genres')
                    .insert({
                        story_id,
                        genre_id
                    })
            }
        }
   


}