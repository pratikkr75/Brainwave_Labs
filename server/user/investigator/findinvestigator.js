import {InvestigatorModel, investigatorSchema} from '../../model/investigator.model.js'; 
import express from 'express';


const findInvestigator = express.Router();

findInvestigator.get('/api/findInvestigator',async(req,res)=>{
    try{
        const {searchText} = req.query;
        if (!searchText) {
            return res.status(400).json({ message: "Search text is required." });
          }
          const investigators = await InvestigatorModel.find({
            email: { $regex: searchText, $options: 'i' } 
          });
          res.status(200).json(investigators);
    }catch(error){
        console.error("Error fetching investigators:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export {findInvestigator};