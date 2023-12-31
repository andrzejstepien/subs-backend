import logger from "../logger.mjs";
import express from "express";
import Entity from "./Entity.mjs";
import Submission from "./Submission.mjs";
import Genres from "./Genres.mjs";

export default class Publication extends Entity {
    constructor(data) {
        super(data)      
        if(data?.link){
            if (this.isString(data.link)) { 
                this.link = data.link
            } else {throw new TypeError("Publication.link must be a string!")}
        }
        if(data?.query_after_days){
            const queryAfter = parseInt(data.query_after_days)
            if(this.isNumber(queryAfter)){
                this.query_after_days = queryAfter
            } else { throw new TypeError("Publication.query_after_days must be a number!")}
        }
    }
    
   static async view(db){
        const data = await db('pubs')
        .select('id as ID','title as Title', 'link as Website')
        const genres = await Genres.init(db)
        return Promise.all(data.map(async row=>{
            row.Submissions = await Submission.submissionsById(db,'pub_id',row.ID)
            row.Genres = genres.genreNamesForEntityId('pubs_genres','pub_id',row.ID)
            return row
        }))
    }

   get table(){
    return 'pubs'
   }
   static table = 'stories'
   get singular(){
    return 'pub'
   }
   static nameCol = 'title'


   static apiPath = '/publication'

   static endpoints(db){
    const router = express.Router()
    router.get('/publication/view', async (req,res)=>{
        logger.trace({ data: req.body }, '/publication/view')
        this.getEndpoint(db, () =>{ return Publication.view(db)}, 'view', res)
    })
    router.post('/publication/edit',async (req,res)=>{
        logger.trace({data:req.body},'/publication/edit')
        this.endpoint(db,()=>{return new Publication(req.body)},'edit',res)
    })
    router.post('/publication/create',async (req,res)=>{
        logger.trace({data:req.body},'/publication/create')
        this.endpoint(db,()=>{return new Publication(req.body)},'create',res)
    })
    router.delete('/publication/delete',async (req,res)=>{
        logger.trace({data:req.body},'/publication/delete')
        this.endpoint(db,()=>{return new Publication(req.body)},'del',res)
    })
   return router
   }


   

}

