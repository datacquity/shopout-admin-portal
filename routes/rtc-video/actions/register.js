const router = require('express').Router();
const axios = require('axios');
const RTCUser = require('../../../models/entities/rtc-user-schema');
const Store = require('../../../models/entities/store-schema');
const Agent = require('../../../models/entities/agent-schema');
const Business = require('../../../models/entities/business-schema');
const Callnow = require('../../../models/operations/call-now-schema');
const User = require('../../../models/entities/user-schema');
const handleError = require('../../../error_handling/handler');
// const Video = require('../../../../../models/operations/video-schema');
const Video = require('../../../models/operations/video-schema');
const https = require('https');
const {
  dispatchSingleNotification,
  dispatchSingleNotificationApple,
} = require('../../../utils/notification-dispatcher');

const callNotificationTitle = 'Incoming call';
const missCallTitle = 'Missed call';

const randomNumber = (min = 0, max = 1) =>
	Math.floor(Math.random() * (max - min) + min);

router.post('/', async (req, res) => {
  try {
    const isExisting = await RTCUser.findOne({
      ref_id: req.body.ref_id,
      channelName: req.body.channelName,
    });

    if (isExisting) {
      const updatedUser = await RTCUser.updateMany(
        { ref_id: req.body.ref_id },
        { uid: req.body.uid }
      );
      if (!updatedUser) {
        return res.status(400).json({
          error: 'Unable to create new RTC user',
        });
      }
      return res.status(200).json({
        status: 'Updated existing RTC user',
      });
    }

    const user = await RTCUser.create(req.body);

    if (!user) {
      return res.status(400).json({
        error: 'Unable to create new RTC user.',
      });
    }

    return res.status(200).json({
      status: 'Created new RTC user',
    });
  } catch (e) {
    handleError(e);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

router.post('/dial', async (req, res) => {
  // pass user _ids as users
  const { user, cred, channelName } = req.body;
  /* const user = {
	_id: '5facec343724a207c25aba2d'
  }
  const cred = {
	phone: '9867927529'	
  } */
  try {
    let store;
    if (cred.phone) {
      store = await Store.findOne({ phone: cred.phone }).populate({
        path: 'business',
        select: 'display_name',
      });
    }
    if (cred.loginID) {
      store = await Agent.findOne({ loginID: cred.loginID }).populate({
        path: 'business',
        select: 'display_name',
      });
    }

    //console.log(store.business.images[0]);
    if (!store) return res.status(404).json({ error: 'Store not found' });
    const savedUser = await User.findOne(user);
    if (savedUser) {
      const data = {
        type: 'call',
        channelName,
        display_name: store.business.display_name,
      };
      dispatchSingleNotification(
        savedUser.firebaseToken,
        callNotificationTitle,
        `📞 ${store.business.display_name} is calling`,
        data
      );
      dispatchSingleNotificationApple(
        savedUser.deviceToken,
        callNotificationTitle,
        `📞 ${store.business.display_name} is calling`,
        data
      );
      return res.status(200).json({ response: 'Call connected' });
    }
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Agents's _id in agentDetails
// user phone in cred
// User calls Agent
router.post('/agent/call', async (req, res) => {
  const { agentDetails, callID, cred } = req.body;
  try {
    const user = await User.findOne({ phone: cred.phone });
    if (!user) return res.status(401).json({ error: 'Invalid User' });

    const agent = await Agent.findById(agentDetails._id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const userName = `${user.firstName} ${user.lastName}`;
    if (agent) {
      await Callnow.findByIdAndUpdate(callID, { status: 'progress' });
      const data = {
        type: 'call',
        channelName: agent.channel,
        display_name: userName,
      };
      dispatchSingleNotification(
        agent.firebaseToken,
        callNotificationTitle,
        `📞 ${userName} is calling`,
        data
      );
      dispatchSingleNotificationApple(
        agent.deviceToken,
        callNotificationTitle,
        `📞 ${userName} is calling`,
        data
      );
      return res
        .status(200)
        .json({ response: 'Call connected', channel: agent.channel });
    }
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// user's phone in userDetails
// agent's loginID in cred
// Agent calls User
router.post('/user/call', async (req, res) => {
  const { userDetails, cred } = req.body;
  try {
    const agent = await Agent.findOne({ loginID: cred.loginID });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const user = await User.findOne({ phone: userDetails.phone });
    if (!user) return res.status(401).json({ error: 'Invalid User' });

    const userName = agent.name;
    if (agent) {
      const data = {
        type: 'call',
        channelName: agent.channel,
        display_name: userName,
      };
      dispatchSingleNotification(
        user.firebaseToken,
        callNotificationTitle,
        `📞 ${userName} is calling`,
        data
      );
      dispatchSingleNotificationApple(
        user.deviceToken,
        callNotificationTitle,
        `📞 ${userName} is calling`,
        data
      );
      return res
        .status(200)
        .json({ response: 'Call connected', channel: agent.channel });
    }
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/missedCall', async (req, res) => {
  // pass user _ids as users
  const { user } = req.body;
  /* const user = {
	_id: '5facec343724a207c25aba2d'
  }*/
  try {
    const savedUser = await User.findOne(user);
    if (savedUser) {
      const data = {
        type: 'call',
        caller: JSON.stringify(savedUser),
      };
      dispatchSingleNotification(
        savedUser.firebaseToken,
        missCallTitle,
        `You missed a Video call 📞`,
        data
      );
      dispatchSingleNotificationApple(
        savedUser.deviceToken,
        missCallTitle,
        `You missed a Video call 📞`,
        data
      );
      return res
        .status(200)
        .json({ response: 'Missed Call Notification Sent' });
    }
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload a store
// router.post('/video', async (req, res) => {
//   try {
//     const { videoData } = req.body;
//     console.log(videoData);
//     // res.json({ success: 'true' });

//     const id = videoData.businessId;
//     const business = await Business.findOne({_id : id},(err,foundBusiness)=>{}).select("category tags display_name");
//     console.log(business.category);
//     console.log(business.tags);
//     let newVideo = new Video({
//       likes : videoData.likes,
//       dislikes : videoData.dislikes,
//       // category : business.category,
//       // tags : business.tags,
//       source : videoData.source,
//       business : videoData.businessId,
//       description : videoData.description,
//       title : videoData.title,
//       thumbnail : videoData.thumbnail,
//       date : videoData.date
//     })
//     // res.json({ success: 'true' , business : business });

//     newVideo.save((err, savedVideo) => {
//       if (err) {
//           console.error("Error", err);
//       }
//       res.json({success : "New video has uploaded." , business : business , video : savedVideo});
//   });
//   } catch (e) {
//     console.log(e);
//   }
// });

const YT_API = {
  KEY: 'AIzaSyA32ohOnDkx67VeyorHKWxuHOc1ItPxFRM',
  URI: {
    SNIPPET: 'www.googleapis.com/youtube/v3/videos?part=snippet',
  },
};

router.post('/video', async (req, res) => {
  try {
    const { videoData } = req.body;

    // console.log(videoData);
    const id = videoData.businessId;

    // console.log(id);

    const business = await Business.findOne(
      { _id: id },
      (err, foundBusiness) => {}
    ).select('category tags display_name');

    // console.log(business);

    const options = {
      host: 'www.googleapis.com',
      path: `/youtube/v3/videos?part=snippet&id=${videoData.source}&key=${YT_API.KEY}`,
      method: 'GET',
      headers: {
        'content-type': 'application/JSON',
      },
    };

    // https
    // 	.request(options, (response) => {
    // 		let videoDetails = "";
    // 		response.on("data", (chunk) => {
    // 			videoDetails += chunk;
    // 		});
    // 		response.on("end", () => {
    // 			const details = JSON.parse(videoDetails);})};

    const request = https.request(options, (response) => {
      let videoDetails = '';
      response.on('data', (chunk) => {
        // console.log(chunk);
        videoDetails += chunk;
      });
      response.on('end', () => {
        const details = JSON.parse(videoDetails);
        // console.log(details);
        const { snippet } = details.items[0];
        console.log(snippet);
        const source = details.items[0].id;
        console.log(source);
        const { title, publishedAt, description } = snippet;
        const thumbnail = details.items[0].snippet.thumbnails.default.url;
        console.log(thumbnail);
        console.log(title, publishedAt, description);
        let newVideo = new Video({
          likes: randomNumber(500, 1000),
          dislikes: randomNumber(0, 40),
          category : business.category,
          tags : business.tags,
          source: source,
          business: videoData.businessId,
          description: description,
          title: title,
          thumbnail: videoData.thumbnail,
          date: publishedAt,
        });
        newVideo.save((err, savedVideo) => {
                if (err) {
                    console.error("Error", err);
                }
                res.json({success : "New video has uploaded." , business : business , video : savedVideo , details : details});
            });
        // res.json({ video: videoData, business: business, details: details });
      });
    });
    request.on('error', (error) => {
      console.log('An error', error);
    });
    request.end();

    // res.json({video : videoData , business : business});
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
