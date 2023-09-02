import { DateTime } from "luxon"


export class Entity extends Object {
    
    constructor(data) {
        super()
        if(data?.id){
            const id = parseInt(data.id)
            if(this.isNumber(id)){
                this.id=id
            } else { throw new TypeError("id must be a number")}
        }
        if (this.isString(data?.title)) {
            this.title = data.title
        } else { throw new TypeError("title must be a string!") }
    }


    async del(db) {
        if(!this?.id){throw new Error("cannot delete entity without id!")}
            const res = await db(this.table)
                .where('id', this.id)
                .delete()
                return res===1
    }
    async create (db){
        console.log("table: "+this.table)
        const res = await db(this.table)
        .insert(this)
        .returning('id')
        return res===0?false:res[0].id
    }
    async edit(db){
        if(!this?.id){throw new Error("cannot edit entity without id!")}
        const res = await db(this.table)
        .where('id',this.id)
        .update(this)
        return res===1
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

}

