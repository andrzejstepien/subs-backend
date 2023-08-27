import express from "express"
import pinoHTTP from 'pino-http'
import logger from "./logger.mjs";
import bodyParser from "body-parser";
import { newStory } from "./postCalls.mjs";
import cors from "cors";
import { selectFull, selectEntityGenres, selectAllEntityGenres, selectCleanArray, getStoriesPageData, getSingleStoryPageData } from "./selectCalls.mjs";
import { storyExists } from "./existsCalls.mjs";
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

app.get('/api/submissions', async (req, res) => {
  logger.info("submissions request received!")
  res.statusCode = 200
  const result = await selectFull(db, 'submissions')
  res.send(result)
})
app.get('/api/stories', async (req, res) => {
  logger.info("stories request received!")
  res.statusCode = 200
  const result = await selectCleanArray(db, 'stories', 'title')
  res.send(result)
})
app.get('/api/stories/full', async (req, res) => {
  logger.info("stories full request received!")
  res.statusCode = 200
  const result = await selectFull(db, 'stories')
  res.send(result)
})
app.get('/api/publishers', async (req, res) => {
  logger.info("publishers request received!")
  res.statusCode = 200
  const result = await selectCleanArray(db, 'pubs', 'title')
  res.send(result)
})
app.get('/api/genres', async (req, res) => {
  logger.info("genres request received!")
  res.statusCode = 200
  const result = await selectCleanArray(db, 'genres', 'name')
  res.send(result)
})
app.get('/api/stories-genres', async (req, res) => {
  logger.info("stories-genres request received")
  const data = req.body
  if (!data?.story) {
    try {
      res.statusCode = 200
      const result = await selectAllEntityGenres(db,'stories')
      res.send(result)
    } catch (error) {
      logger.error(error)
      res.statusCode = 400
      res.send("No can do!")
    }
  } else {
    try {
      res.statusCode = 200
      const result = await selectEntityGenres(db, 'stories',data.story)
      res.send(result)
    } catch (error) {
      logger.error(error)
      res.send("No can do! Does the story exist?")
    }
    
  }
})

app.get('/api/page/stories', async (req,res) => {
  logger.info("stories page data request received!")
  res.statusCode = 200
  const result = await getStoriesPageData(db)
  res.send(result)
})
app.get('/api/page/single-story', async (req,res) => {
  const data = req.query
  logger.info({req},"stories page data request received!")
  if(!data.title){
    logger.warn("BAD REQUEST: no story title!")
    res.sendStatus(400)
  }else{
    try {
      const result = await getSingleStoryPageData(db,data.title)
      res.statusCode = 200
      res.send(result)
    } catch (error) {
      logger.error(error)
    }
    
    
  }
  
})


app.post('/api/stories', async (req, res) => {
  logger.info("add story request received!")
  res.statusCode = 200
  const data = req.body
  logger.trace({ data }, "BODY")
  try {
    const result = await newStory(db, data)
    logger.info({ result }, "INSERTION SUCCESSFUL")
  } catch (error) {
    logger.error(error)
  }
})





app.listen(port, (err) => {
  if (err) logger.error(err);
  logger.info("Server listening on PORT " + port)
})


export default app