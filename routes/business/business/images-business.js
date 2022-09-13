const router = require('express').Router();

// const Business = require("../../utils/csvtomongo/models/business-schema");

const Business = require('../../../models/entities/business-schema');

router.post('/business/images' , async(req,res) => {

    const {storeData} = req.body;

    const businessId = storeData.businessId;

    const newImages = storeData.newImages;

    console.log(businessId);

    console.log(newImages);

    for (let i = 0;i<newImages.length;i++){
        Business.findOneAndUpdate(
            {_id : businessId},
            {$push : {images : newImages}},
            (err, savedBusiness) => {
                if (err) console.error(err);
                else console.log("Saved a Image(s) for", savedBusiness.name);
            }
        )
    }

});

module.exports = router;