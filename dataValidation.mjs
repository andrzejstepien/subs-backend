import { DateTime } from "luxon"

export const keyExists = (obj,key)=>{
    if(obj.hasOwnProperty(key)){return true}
    throw new Error(`missing key: ${key}`,{cause:{key},obj})
}
export const valueIsNumber = (obj,key) => {
    if(typeof obj?.[key] != "number"){throw new TypeError(`${obj[key]} is not a number`,{cause:{key},obj})}
    return true
}

export const isString = (s) =>{
    if(typeof s === 'string'){return true}
    throw new TypeError("not a string!")
}

export const isNumber = (n) =>{
if(typeof n === "number"){return true}
throw new TypeError("not a number!")
}

export const dateStringIsValid = (str) => {
    if(str===null){return true}
    if(DateTime.fromFormat(str,'yyyy-MM-dd').isValid){
        return true
    }
    throw new TypeError('date invalid',{cause:{date:str},str})
}