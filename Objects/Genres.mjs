import logger from "../logger.mjs";


export default class Genres{
    constructor(data){
        this.stories_genres=data.stories_genres
        this.pubs_genres=data.pubs_genres
        this.genres={}
        for (const obj of data.genres) {
            this.genres[obj.name]=obj.id
        }
        
    }

    static async init(db){
        const stories_genres = await (db)
        .select('*')
        .from('stories_genres')
        const pubs_genres = await (db)
        .select('*')
        .from('pubs_genres')
        const genres = await (db)
        .select('*')
        .from('genres')
        return new Genres(
            {
                stories_genres,
                pubs_genres,
                genres
            })
    }
    idsForEntity(entity){
        const idCol = this.tableName(entity)
        const output = []
        for (const pair of this.stories_genres) {
            if(pair.story_id===entity.id){output.push(pair.genre_id)}
        }
        return output
    }

    names(){
       return Object.keys(this.genres) 
    }

    idColName(entity){
        return entity.singular+'_id'
    }
    tableName(entity){
        return entity.table+'_genres'
    }

    async update(db,entity){
        const table = entity.table+"_genres"
        const entityId = this.idColName(entity)
        const array = []
        for (const key in entity.genres) {
            if(entity.genres[key]){
                array.push(
                    {
                        [entityId]:entity.id,
                        genre_id:this.genres[key]
                    }
                )
            }
        } 
        return db(table)
        .insert(array)
    }
    async deleteForEntity(db,entity){
        const table = this.tableName(entity)
        const col = this.idColName(entity)
        return db(table)
        .where(col,entity.id)
        .del()
    }
}   