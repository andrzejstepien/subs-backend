
export const selectSubmissions = async (db) => {
    return db('submissions')
    .select('*')
}

export const selectStories = async (db) => {
    return db('stories')
    .select('title')
}

export const selectPublishers = async (db) => {
    return db('pubs')
    .select('title')
}

export const selectGenres = async (db) => {
    return db('genres')
    .select('name')
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

