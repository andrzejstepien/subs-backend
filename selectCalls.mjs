
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

export const selectSubmissions = async (db) => {
    return db('submissions')
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
