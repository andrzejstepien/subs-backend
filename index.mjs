import express from "express"
import pinoHTTP from 'pino-http'
import logger from "./logger.mjs";
import bodyParser from "body-parser";
import cors from "cors";
import Story from "./Objects/Story.mjs";
import Publication from "./Objects/Publication.mjs";
import Submission from "./Objects/Submission.mjs";
import Genres from "./Objects/Genres.mjs";
import { db } from "./db.mjs";

const app = express()
const port = 4000
app.use(
  pinoHTTP({
    logger,
  }),
  cors({
    origin: ['http://localhost:5173']
  }),
  bodyParser.json()
)


app.use('/api', Publication.endpoints(db))
app.use('/api', Story.endpoints(db))
app.use('/api', Submission.endpoints(db))

app.get('/api/form-options',async (rew,res)=>{
  try {
    const genres = await Genres.init(db)
    const formOptions = {
      stories:await Story.list(db),
      publications:await Publication.list(db),
      genres:genres.list.slice(1)
    }
    res.statusCode=200
    res.send(formOptions)
  } catch (error) {
    logger.error(error)
    res.sendStatus(500)
  }
})

app.listen(port, (err) => {
  if (err) logger.error(err);
  logger.info("Server listening on PORT " + port)
})


export default app