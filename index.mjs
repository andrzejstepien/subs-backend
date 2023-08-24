import express from "express"
import pinoHTTP from 'pino-http'
import logger from "../logger.mjs";
import  cors  from "cors";
import { selectSubmissions, selectStories, selectPublishers, selectGenres } from "./selectCalls.mjs";

const app = express()
const port = 4000

app.use(
    pinoHTTP({
      logger,
    }),
    cors({
      origin: ['http://localhost:5173']
    })
  )

app.get('/api/submissions', async (req,res) => {
    logger.info("submissions request received!")
    res.statusCode = 200
    const result = await selectSubmissions()
    res.send(result)
})
app.get('/api/stories', async (req,res) => {
  logger.info("submissions request received!")
  res.statusCode = 200
  const result = await selectStories()
  res.send(result)
})
app.get('/api/publishers', async (req,res) => {
  logger.info("submissions request received!")
  res.statusCode = 200
  const result = await selectPublishers()
  res.send(result)
})
app.get('/api/genres', async (req,res) => {
  logger.info("submissions request received!")
  res.statusCode = 200
  const result = await selectGenres()
  res.send(result)
})

app.listen(port, (err)=>{
    if (err) logger.error(err);
    logger.info("Server listening on PORT " + port)
})