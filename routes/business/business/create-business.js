const router = require('express').Router();

// const Business = require("../../utils/csvtomongo/models/business-schema");

const Business = require('../../../models/entities/business-schema');

// Create Business

router.post('/business', async (req, res) => {
  try {
    const { businessData } = req.body;
    let tags = businessData.tags.toString().toLowerCase().split(',');
    let brands = businessData.brands.toString().toLowerCase().split(',');
    let category = businessData.category.toString();
    let name = businessData.name.toLowerCase();

    // console.log(businessData.title_image);
    // console.log(businessData.images);

    let newBusiness = new Business({
      name: name,
      phone: businessData.phone,
      email: businessData.email,
      password: businessData.password,
      logo: businessData.logo,
      description: businessData.description,
      images: businessData.images,
      title_image : businessData.title_image,
      tags: [...tags, category],
      brands: brands,
      category: category,
      display_name: businessData.display_name,
      hasCallNow : businessData.hasCallNow
    });

    newBusiness.save((err, savedBusiness) => {
      if (err) {
        console.error(err);
      } else  {
        let businessID = savedBusiness._id;
        console.log('Business ID:', businessID);

        // addCategory(category, businessID);
        // addTags(tags, businessID);
        // addBrands(brands, businessID);
      }
      res.json({success : "New business has created." , business : savedBusiness});
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});

//Upload Image for Business after creating business.

router.post('/business/images' , async(req,res) => {

  const {businessNewImages} = req.body;

  const businessId = businessNewImages.businessId;

  const newImages = businessNewImages.newImages;

  console.log(businessId);

  // console.log(newImages);

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
