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
    if(genreIds===[]){return []}
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
    const obj = {}
    for (const story of stories) {
        const genres = await selectStoryGenres(db,story)
        obj[story]=[genres][0]
    }
    return obj
}

export const getStoryId = async (db,story) => {
    const res = await db('stories')
    .select('id')
    .where('title',story)
    if(res==[]){throw new Error("story title not recognised")}
    return res[0]?.id 
}



export const selectStoriesFull = async (db) => {
    return db('stories')
    .select('*')
}
