const router = require('express').Router();

const Store = require('../../../models/entities/store-schema');

router.get("/all", async (req , res)=>{
    // res.json({success : "Hello"});
    // ME.find({ pictures: { $exists: true, $ne: [] } })
    
    try{

        // res.json({success : "true"});
        const store = await Store.find((err,foundBusiness)=>{
        
        }).select("business name").populate({path : "business" , select : "display_name"});
        // const buiness = store.select("name");
        res.json({success : "true" , store : store});
    }
    catch(e){
        console.log(e);
    }
    // res.json({success : "false"});
})

module.exports = router;