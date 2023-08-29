import { keyExists, valueIsNumber, dateStringIsValid } from "./dataValidation.mjs"

    



export default async (db,data)=>{
    if(['id','story_id','pub_id', 'date_submitted', 'date_responded','response_id']
    .every(e=>keyExists(data,e))
    && ['id','story_id','pub_id','response_id']
    .every(e=>valueIsNumber(data,e))
    &&
    ['date_submitted', 'date_responded']
    .every(e=>dateStringIsValid(data[e]))
    ){
       await db('subs')
        .where('id',data.id)
        .update(data)
        return true
    }
}