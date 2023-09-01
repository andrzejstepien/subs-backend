import { isNumber } from "./dataValidation.mjs"
export default async (db,table,id)=>{
    if(isNumber(id)){
        return db(table)
    .where('id',id)
    .delete()
    .returning('id')
    } 
}