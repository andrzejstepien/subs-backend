import logger from "../logger.mjs";
import express from "express";
import Entity from "./Entity.mjs";

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
    
   get table(){
    return 'pubs'
   }
   get singular(){
    return 'pub'
   }

   static endpoints(db){
    const router = express.Router()
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

