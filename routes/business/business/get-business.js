const router = require('express').Router();
var ObjectId = require('mongodb').ObjectId; 

// const Business = require('../../../models/entities/business-schema');

const Business = require('../../../models/entities/business-schema');

const Store = require('../../../models/entities/store-schema');

// const Business = require("../../utils/csvtomongo/models/business-schema");

const Category = require("../../../models/classifiers/category-schema.js");

router.get("/all", async (req , res)=>{
    // res.json({success : "Hello"});
    // ME.find({ pictures: { $exists: true, $ne: [] } })
    
    try{
        const business = await Business.find({name : {$exists : true}}, (err,foundBusiness)=>{
        
        }).select("name display_name");
        res.json({success : "true" , business : business});
    }
    catch(e){
        console.log(e);
    }
    // res.json({success : "false"});
})

router.post("/oneBusiness" , async (req,res)=>{
    
    try{
        const {data} = req.body;

        const stores = await Business.findById({_id : data.id},(err,foundBusiness)=>{}).select("name display_name stores").populate({path : "stores" , select : "name"});

        res.json({success : "true" , business : stores});
    }
    catch(e){
        console.log(e);
    }
})

module.exports = router;