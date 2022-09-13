const router = require('express').Router();
const { ObjectId } = require('mongodb');
const Brand = require('../../../../../models/classifiers/brand-schema');
const Business = require('../../../../../models/entities/business-schema');
const Tag = require('../../../../../models/classifiers/tag-schema');
const Video = require('../../../../../models/operations/video-schema');
const handleError = require('../../../../../error_handling/handler');

const featuredStores = [
  ObjectId('5fb916e2e7c2542ff8e97a6e'),
  ObjectId('605466863ce0e8a178ec1796'),
  ObjectId('605cc5508d2b05b6fc98a609'),
  ObjectId('5fec6a61270e29143896dfee'),
  ObjectId('60210dfd5bd06f2de0663ba3'),
];

const categoryStores = [
  ObjectId('605466863ce0e8a178ec1796'),
  ObjectId('5fb916e2e7c2542ff8e97a6e'),
  ObjectId('605cc5508d2b05b6fc98a609'),
  ObjectId('5fb916e2e7c2542ff8e97a67'),
  ObjectId('5fc7c82c7f2e5407b0ecceca'),
  ObjectId('60210dfd5bd06f2de0663b8e'),
  ObjectId('5fd257cceb5ab32ea422c4e0'),
  ObjectId('6031014df1601e256802c9ad'),
  ObjectId('6031014df1601e256802c9ab'),
  ObjectId('60210dfd5bd06f2de0663bb1'),
  ObjectId('5fd257cceb5ab32ea422c4de'),
  ObjectId('5fd2571bfa0fd31a88c99310'),
  ObjectId('6031014df1601e256802c9ae'),
  ObjectId('60210dced413262374ba0b59'),
  ObjectId('5fd257a9ba0d3527443bb2a7'),
  ObjectId('5fd257a9ba0d3527443bb2a8'),
  ObjectId('5fd257cceb5ab32ea422c4de'),
  ObjectId('60210dced413262374ba0b5b'),
  ObjectId('6031014df1601e256802c9ae'),
  ObjectId('60210dced413262374ba0b59'),
  ObjectId('5fd257a9ba0d3527443bb2a7'),
  ObjectId('5fd257a9ba0d3527443bb2a8'),
  ObjectId('5fec6a61270e29143896dfdd'),
  ObjectId('5fec6a61270e29143896dfe5'),
  ObjectId('5fec6a61270e29143896dfe7'),
  ObjectId('5ff31efcaf2478f94a865f36'),
  ObjectId('5fec6a61270e29143896dfeb'),
  ObjectId('5fec6980e4fb092aac7e9096'),
  ObjectId('5fec6980e4fb092aac7e9098'),
  ObjectId('5ff320afaf2478f94a865f38'),
  ObjectId('5fec6980e4fb092aac7e909b'),
  ObjectId('5fec6a61270e29143896dfed'),
  ObjectId('5fec6a61270e29143896dfee'),
  ObjectId('60210dfd5bd06f2de0663b7a'),
  ObjectId('60210dfd5bd06f2de0663b7f'),
  ObjectId('6031014df1601e256802c9a9'),
  ObjectId('60210dfd5bd06f2de0663b82'),
  ObjectId('60210dfd5bd06f2de0663b84'),
  ObjectId('60210dfd5bd06f2de0663b86'),
  ObjectId('60210dfd5bd06f2de0663b89'),
  ObjectId('60210dfd5bd06f2de0663b8f'),
  ObjectId('60210dfd5bd06f2de0663b90'),
  ObjectId('60210dfd5bd06f2de0663b91'),
  ObjectId('60210dfd5bd06f2de0663b93'),
  ObjectId('60210dfd5bd06f2de0663b95'),
  ObjectId('60210dfd5bd06f2de0663b9a'),
  ObjectId('60210dfd5bd06f2de0663b9e'),
  ObjectId('60210dfd5bd06f2de0663b9f'),
  ObjectId('60210dfd5bd06f2de0663ba0'),
  ObjectId('60210dfd5bd06f2de0663ba3'),
  ObjectId('60210dfd5bd06f2de0663ba4'),
  ObjectId('60210dfd5bd06f2de0663ba9'),
  ObjectId('6030fb7b878fdd23f843b65a'),
  ObjectId('6030f07ff72f8a1ddcf11e1c'),
  ObjectId('6031074185dbd91b6847064b'),
  ObjectId('6031074185dbd91b6847064d'),
  ObjectId('6031074185dbd91b68470658'),
  ObjectId('6031074185dbd91b6847065a'),
  ObjectId('6031074185dbd91b6847065b'),
  ObjectId('603e22fb5d79ff6f9babcdfd'),
  ObjectId('604a489c6350e937bc8f7f23'),
  ObjectId('6051021cfd6bfa57ec9734a8'),
  ObjectId('60510212fd6bfa57ec9734a6'),
  ObjectId('60510212fd6bfa57ec9734a7'),
  ObjectId('60510222fd6bfa57ec9734a9'),
  ObjectId('6051af0a5e18b26d0c6f8921'),
  ObjectId('605466863ce0e8a178ec1799'),
  ObjectId('6054668e3ce0e8a178ec179a'),
  ObjectId('605466863ce0e8a178ec1796'),
  ObjectId('605466863ce0e8a178ec1797'),
  ObjectId('605cc5508d2b05b6fc98a609'),
  ObjectId('605e252ec0e4e65188320495'),
  ObjectId('606ac127ae3a3d2a04e7128a'),
];
const defaultAggreagations = [
  { $match: { _id: { $in: featuredStores } } },
  { $sample: { size: 5 } },
];

const populateVideos = async (videos) => {
  try {
    await Business.populate(videos, {
      path: 'business',
      select: 'display_name',
    });
    await Tag.populate(videos, {
      path: 'tag',
      select: 'name _id',
    });
    await Brand.populate(videos, {
      path: 'brand',
      select: 'name _id',
    });
    return videos;
  } catch (e) {
    handleError(e);
    return [];
  }
};

const fetchVideos = async (aggregations = defaultAggreagations) =>
  new Promise((resolve, reject) => {
    Video.aggregate(aggregations, async (err, videos) => {
      if (err) reject(err);
      const result = await populateVideos(videos);
      resolve(result);
    });
  });

// Top featured videos
router.post('/featured', (req, res) => {
  fetchVideos()
    .then((videos) => res.status(200).json({ response: videos }))
    .catch(() => res.status(500).json({ error: 'Internal server error' }));
});

// videos of one category
router.post('/category/single', (req, res) => {
  const { name } = req.query;
  const modifiedQuery = new RegExp(`${name}`, 'i');
  const aggregations = [
    { $match: { category: {$regex: modifiedQuery} } },
    {
      $sample: {
        size: 5,
      },
    },
  ];

  fetchVideos(aggregations)
    .then((videos) => res.status(200).json({ response: videos }))
    .catch(() => res.status(500).json({ error: 'Internal server error' }));
});

router.post('/business', (req, res) => {
  const { _id } = req.body;
  const aggregations = [
    { $match: { business: ObjectId(_id) } },
    {
      $sample: {
        size: 10,
      },
    },
  ];

  fetchVideos(aggregations)
    .then((videos) => res.status(200).json({ response: videos }))
    .catch(() => res.status(500).json({ error: 'Internal server error' }));
});

module.exports = router;
