import { Entity } from "./Entity.mjs"

export class Story extends Entity {
    constructor(data){
        super(data)
        const wordcount = parseInt(data?.word_count)
    if(this.isNumber(wordcount)){
        this.word_count = wordcount
    } else { throw TypeError("word_count must be a number")}
    }
       
    get table(){
        return 'stories'
    }
}