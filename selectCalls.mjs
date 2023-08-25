

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

