import { keyExists, valueIsNumber, dateStringIsValid } from "../dataValidation.mjs"

    
const validateData = (data) => {
    return ['id','story_id','pub_id', 'date_submitted', 'date_responded','response_id']
    .every(e=>keyExists(data,e))
    && ['id','story_id','pub_id','response_id']
    .every(e=>valueIsNumber(data,e))
    &&
    ['date_submitted', 'date_responded']
    .every(e=>dateStringIsValid(data[e]))
}


export const editSubmission = async (db,data)=>{
    if(validateData(data)){
       await db('subs')
        .where('id',data.id)
        .update(data)
        return true
    }
}

export const newSubmission = async (db,data)=>{
    if(['story_id','pub_id', 'date_submitted', 'date_responded','response_id']
    .every(e=>keyExists(data,e))
    && ['story_id','pub_id','response_id']
    .every(e=>valueIsNumber(data,e))
    &&
    ['date_submitted', 'date_responded']
    .every(e=>dateStringIsValid(data[e]))
    ){
       await db('subs')
        .insert(data)
        return true
    }
}