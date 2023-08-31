import { DateTime } from "luxon"

export const keyExists = (obj,key)=>{
    if(obj.hasOwnProperty(key)){return true}
    throw new Error(`missing key: ${key}`,{cause:{key},obj})
}
export const valueIsNumber = (obj,key) => {
    if(typeof obj?.[key] != "number"){throw new TypeError("not a number",{cause:{key},obj})}
    return true
}

export const dateStringIsValid = (str) => {
    if(str===null){return true}
    if(DateTime.fromFormat(str,'yyyy-MM-dd').isValid){
        return true
    }
    throw new TypeError('date invalid',{cause:{date:str},str})
}