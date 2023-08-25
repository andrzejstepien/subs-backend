import express from "express"
import pinoHTTP from 'pino-http'
import logger from "./logger.mjs";
import bodyParser from "body-parser";
import { newStory } from "./postCalls.mjs";
import  cors  from "cors";
import { selectSubmissions, selectStories, selectPublishers, selectGenres } from "./selectCalls.mjs";
import { db } from "./db.mjs";

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
  app.use(bodyParser.json())

app.get('/api/submissions', async (req,res) => {
    logger.info("submissions request received!")
    res.statusCode = 200
    const result = await selectSubmissions(db)
    res.send(result)
})
app.get('/api/stories', async (req,res) => {
  logger.info("submissions request received!")
  res.statusCode = 200
  const result = await selectStories(db)
  res.send(result)
})
app.get('/api/publishers', async (req,res) => {
  logger.info("publishers request received!")
  res.statusCode = 200
  const result = await selectPublishers(db)
  res.send(result)
})
app.get('/api/genres', async (req,res) => {
  logger.info("genres request received!")
  res.statusCode = 200
  const result = await selectGenres(db)
  res.send(result)
})
app.get('/api/story-genres', async (rew,res) => {
  logger.info("story-genres request received")
  const data = req.body
  if(!data?.story){
    res.statusCode = 400
    res.send("Request must specify a story")
  } else if(){

  }
})

app.post('/api/stories', async (req,res) => {
  logger.info("add story request received!")
  res.statusCode = 200
  const data = req.body
  logger.trace({data},"BODY")
  try {
    const result = await newStory(data)
    logger.info({result},"INSERTION SUCCESSFUL")
  } catch (error) {
    logger.error(error)
  }  
})





app.listen(port, (err)=>{
    if (err) logger.error(err);
    logger.info("Server listening on PORT " + port)
})