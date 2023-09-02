import { Entity } from "./Entity.mjs";

export class Publication extends Entity {
    constructor(data) {
        super(data)
        
        
        
        if (this.isString(data?.link)) { 
            this.link = data.link
        } else {throw new TypeError("Publication.link must be a string!")}
        const queryAfter = parseInt(data.query_after_days)
        if(this.isNumber(queryAfter)){
            this.query_after_days = queryAfter
        } else { throw new TypeError("Publication.query_after_days must be a number!")}
        
    }
    
   get table(){
    return 'pubs'
   }
}

