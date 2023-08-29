import { DateTime } from "luxon";
import { db } from "./db.mjs";
import { selectFull } from "./selectCalls.mjs";

const table = await selectFull(db,'subs')

const ddmmyyyyToyyyymmdd = (str) =>{
    return DateTime.fromFormat(str,'dd/MM/yyyy').toFormat('yyyy-MM-dd').toString()
  }

for (const row of table) {
    await db('subs')
    .where('id',row.id)
    .update({
        date_submitted: ddmmyyyyToyyyymmdd(row.date_submitted),
        date_responded: ddmmyyyyToyyyymmdd(row.date_responded)
    })
}
