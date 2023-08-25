import logger from "./logger.mjs"
export const selectCleanArray = async (db,table,column) =>{
    const res = await db(table)
    .select(column)
    return res.map(e=>{
        return e[Object.keys(e)[0]]
    })
}

export const selectFull = async (db,table) => {
    return db(table)
    .select('*')
}






export const selectStoryGenres = async (db,story) => {
    const storyId = await getStoryId(db,story)  
    let genreIds = await db('stories_genres')
    .select('genre_id')
    .where('story_id',storyId)
    genreIds = genreIds.map(e=>{
        return e.genre_id
    })
    return Promise.all(genreIds.map(async id=>{
        const res = await db('genres')
        .select('name')
        .where('id',id)
        return res[0].name
    }))
}

export const selectAllStoryGenres = async (db) => {
    const stories = await selectCleanArray(db,'stories','title')
    logger.trace({stories},"STORIES")
    const obj = {}
    for (const story of stories) {
        obj[story]=[await selectStoryGenres(db,story)]
    }
    logger.trace(obj, "selectAllStoryGenres RETURNS")
    return obj
}

export const getStoryId = async (db,story) => {
    const res = await db('stories')
    .select('id')
    .where('title',story)
    return res[0].id
}



export const selectStoriesFull = async (db) => {
    return db('stories')
    .select('*')
}
