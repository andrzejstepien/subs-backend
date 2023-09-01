export default async (db,table,id)=>{
    return db(table)
    .where('id',id)
    .delete()
    .returning('id')
}