import { DateTime } from "luxon"
import logger from "../logger.mjs"
//import Genres from "./Genres.mjs"
export default class Entity {
    #genres
    constructor(data) {
        
        if(data?.id){
            const id = parseInt(data.id)
            if(this.isNumber(id)){
                this.id=id
            } else { throw new TypeError(".id must be a number")}
        }
        if(data?.title){
            if (this.isString(data?.title)) {
                this.title = data.title
            } else { throw new TypeError(".title must be a string!") }
        }
        if(data?.genres){
            if(this.isObject(data.genres)){
                this.#genres = data.genres
            } else { throw new TypeError(".genres must be an object!")}
        }
        
    }
   
    get genres(){
        if(this.#genres){
            return this.#genres
        }
        return false
    }

    async del(db) {
        if(!this?.id){throw new Error("cannot delete entity without id!")}
            const res = await db(this.table)
                .where('id', this.id)
                .delete()
                return res===1
    }
    async create (db){
        const res = await db(this.table)
        .insert(this)
        .returning('id')
         if(res===0){
            logger.trace("res===0, returning false")
            return false
        }
        const newId = res[0].id
         if(!this.genres){
            logger.trace("no genre data, returning newId: "+newId)
            return newId}
        const genres = await Genres.init(db)
        await genres.deleteForEntity(db,this)
        const res2 = await genres.update(db,this)
        return res2===0?false:true

    }
    async edit(db){
        if(!this?.id){throw new Error("cannot edit entity without id!")}
        const res = await db(this.table)
        .where('id',this.id)
        .update(this)
        return res===1
    }
    async getTable(db,tab){
        return db(tab??this.table)
        .select('*')
    }
    async getColumn(db,col,tab){
        const res = await db(tab??this.table)
        .select(col)
        return res.map(e=>{
            return e[Object.keys(e)[0]]
        }) 
    }
    async getSubmissions(db,id){
        if(!this?.table){return this}
        if(!this.id){throw new Error("can't get submissions without an id!")}
        const useId = id?id:this.id
        const idName = this.table==='stories'?'story_id':this.table==='pubs'?'pub_id':null
        return db('submissions')
        .where(idName,useId)
    }
    
  

    isNumber (n){
        if(isNaN(n)){return false}
        if (typeof n === "number") { return true }
        return false
    }
    isString (s){
        if (typeof s === 'string') { return true }
        return false
    }
    dateStringIsValid(str){
        if(str===null){return true}
        if(DateTime.fromFormat(str,'yyyy-MM-dd').isValid){
            return true
        }
        return false
    }
    isObject(objValue) {
        return objValue && typeof objValue === 'object' && objValue.constructor === Object;
      }

static async endpoint(db,assignment,method,res){
        try {
            const entity = assignment()
            await entity[method](db)
            res.sendStatus(200)
        } catch (error) {
            logger.error(error)
            if(error instanceof TypeError){
                res.sendStatus(400)
            }else{
                res.sendStatus(500)
            }
        }
   }
}

