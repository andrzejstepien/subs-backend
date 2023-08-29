import { DateTime } from "luxon"

export const keyExists = (obj,key)=>{
    if(!obj?.[key]){throw new Error("missing key",{cause:{key}})}
    return true
}
export const valueIsNumber = (obj,key) => {
    if(typeof obj?.[key] != "number"){throw new TypeError("not a number",{cause:{key}})}
    return true
}

export const dateStringIsValid = (str) => {
    if(DateTime.fromFormat(str,'yyyy-MM-dd').isValid){
        return true
    }
    throw new TypeError('date invalid',{cause:{date:str}})
}