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

export const getSubmissionsByPub = async (db,title) => {
    return db('submissions')
    .where('Publication',title)
}


export const getStoriesPageData = async (db) => {
    const storiesData = await db('stories')
    .select('id as ID','title as Title','word_count as Wordcount')
    const storiesGenres = await selectAllEntityGenres(db,'stories')
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
    const genres = await selectEntityGenres(db,'stories',title)
    res.Genres = genres
    return res
}

export const getPublicationsPageData = async (db) => {
    const storiesData = await db('pubs')
    .select('id as ID','title as Title', 'link as Website')
    const pubsGenres = await selectAllEntityGenres(db,'pubs')
    return Promise.all(storiesData.map(async row=>{
        row.Submissions = await getSubmissionsByPub(db,row.Title)
        row.Genres = pubsGenres[row.Title]
        return row
    }))
}

export const selectAllEntityGenres = async (db,table) => {
    const titles = await selectCleanArray(db,table,'title')
    const obj = {}
    for (const title of titles) {
        const genres = await selectEntityGenres(db,table,title)
        obj[title]=[genres][0]
    }
    return obj
}

export const selectEntityGenres = async (db,table,title) => {
    const entityId = await getEntityId(db,table,title)  
    const id = table === 'stories' ? 'story_id' : table === 'pubs' ? 'pub_id' : null
    if(!id){throw new Error("table must be stories or pubs")}
    let genreIds = await db(`${table}_genres`)
    .select('genre_id')
    .where(id,entityId)
    if(genreIds.length===0){return []}
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

export const getEntityId = async (db,table,title) => {
    const res = await db(table)
    .select('id')
    .where('title',title)
    if(res==[]){throw new Error("title not recognised")}
    return res[0]?.id 
}

export const getFormOptions = async (db) => {
    return {
        stories:await selectCleanArray(db,'stories','title'),
        pubs:await selectCleanArray(db,'pubs','title')
    }

}