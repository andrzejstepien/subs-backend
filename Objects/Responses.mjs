export default async function Responses (db){
    const data = await db('responses')
    .select('*')
    const obj = {
        table:{},
        list:[]
    }
    for (const row of data) {
        obj.table[row.response]=row.id
        obj.list=[...obj?.list,row.response]
    }
    return obj
}