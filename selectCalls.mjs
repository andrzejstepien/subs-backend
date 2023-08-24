import { db } from "./db.mjs";

export const selectSubmissions = async () => {
    return db('submissions')
    .select('*')
}

export const selectStories = async () => {
    return db('stories')
    .select('title')
}

export const selectPublishers = async () => {
    return db('pubs')
    .select('title')
}

export const selectGenres = async () => {
    return db('genres')
    .select('name')
}