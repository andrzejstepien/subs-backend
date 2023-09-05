import logger from "../logger.mjs";

export default class Genres{
    constructor(data){
        this.stories_genres=data.stories_genres
        this.pubs_genres=data.pubs_genres
        this.list=[]
        for (const row of data.genres) {
            const diff = row.id - this.list.length
            for (let index = 0; index < diff; index++) {
                this.list.push('')    
            }
            this.list.push(row.name)   
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
        .orderBy('id')
        return new Genres(
            {
                stories_genres,
                pubs_genres,
                genres
            })
    }
    idsForEntity(entity){
        const tab = this.tableName(entity)
        const idCol = entity.idColName
        const output = []
        for (const pair of this[tab]) {
            if(pair[idCol]===entity.id){output.push(pair.genre_id)}
        }
        return output
    }
     genreNamesForEntityId(tab,idCol,id){
        const output = []
        for (const pair of this[tab]) {
            if(pair[idCol]===id){output.push(this.list[pair.genre_id])}
        }
        return output
    }


    names(){
       return this.list.slice(1)
    }


    tableName(entity){
        return entity.table+'_genres'
    }

    async update(db,entity){
        const table = entity.table+"_genres"
        const entityId = entity.idColName
        const array = []
        for (const key in entity.genres) {
            if(entity.genres[key]){
                array.push(
                    {
                        [entityId]:entity.id,
                        genre_id:this.list[key]
                    }
                )
            }
        } 
        return db(table)
        .insert(array)
    }
    async deleteForEntity(db,entity){
        const table = this.tableName(entity)
        const col = entity.idColName
        return db(table)
        .where(col,entity.id)
        .del()
    }
}   