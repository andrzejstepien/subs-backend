import logger from "./logger.mjs"
export const selectCleanArray = async (db,table,column) =>{
    const res = await db(table)
    .select(column)
    return res.map(e=>{
        return e[Object.keys(e)[0]]
    })
}

export const selectRowByColumn = async (db,table,column,value) => {
    const res = await db(table)
    .select('*')
    .where(column,value)
    return res[0]
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


export const getSubmissionsByStory = async (db,title) => {
    return db('submissions')
    .where('Story',title)
}


export const getStoriesPageData = async (db) => {
    const storiesData = await db('stories')
    .select('id as ID','title as Title','word_count as Wordcount')
    const storiesGenres = await selectAllStoryGenres(db)
    return Promise.all(storiesData.map(async row=>{
        row.Submissions = await getSubmissionsByStory(db,row.Title)
        row.Genres = storiesGenres[row.Title]
        return row
    }))
}

export const getSingleStoryPageData = async (db,title) => {
    let res = await db('stories')
    .select('id as ID','title as Title')
    .where('title',title)
    res = res[0]
    const genres = await selectStoryGenres(db,title)
    res.Genres = genres
    return res
}
