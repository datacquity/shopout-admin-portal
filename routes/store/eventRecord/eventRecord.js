const router = require('express').Router();
const verifySession = require('../auth/verifySession');
const handleError = require('../../../error_handling/handler');
const EventRecording = require('../../../models/entities/event-recordings');
const axios = require('axios');

function getUid() {
  return Math.floor(Math.random() * 999999);
}

const acquireApiCall = async (channelName, uid) => {
  try {
    var data = JSON.stringify({
      cname: channelName,
      uid: uid,
      clientRequest: {
        resourceExpiredHour: 24,
      },
    });

    var config = {
      method: 'post',
      url: `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/acquire`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ZmEyNzBhZDgwNjI1NDVmOTgyYThlZTcxYmEwOTMwNWM6MTJkYmYwNmNiNTM3NGU5OGEwN2I2N2YxNzcyNTA4MTg=`,
      },
      data: data,
    };

    let acquireResponse = await axios(config);
    return acquireResponse.data;
  } catch (err) {
    throw err;
  }
};

const startApiCall = async (channelName, resourceId, uid, uids, businessId) => {
  console.log('businessId -> ', businessId);
  console.log('channelName -> ', channelName);
  try {
    var data = JSON.stringify({
      cname: channelName,
      uid: uid,
      clientRequest: {
        recordingFileConfig:{
          avFileType: ['hls', 'mp4'],
        },
        recordingConfig: {
          maxIdleTime: 30,
          streamTypes: 2,
          channelType: 1,
          videoStreamType: 0,
          subscribeVideoUids: uids,
          subscribeAudioUids: uids,
          subscribeUidGroup: 0,
          transcodingConfig: {
            height: 640,
            width: 360,
            bitrate: 500,
            fps: 15,
            mixedVideoLayout: 1,
            backgroundColor: '#000000',
          },
        },
        storageConfig: {
          vendor: 1,
          region: 14,
          bucket: process.env.AWS_BUCKET,
          accessKey: process.env.AWS_ACCESS_KEY,
          secretKey: process.env.AWS_SECRET_KEY,
          fileNamePrefix: [businessId, uid],
        },
      },
    });

    var config = {
      method: 'post',
      url: `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ZmEyNzBhZDgwNjI1NDVmOTgyYThlZTcxYmEwOTMwNWM6MTJkYmYwNmNiNTM3NGU5OGEwN2I2N2YxNzcyNTA4MTg=',
      },
      data: data,
    };
    let startResponse = await axios(config);
    return startResponse.data;
  } catch (err) {
    throw err;
  }
};

const endApiCall = async (channelName, uid, sid, resourceId) => {
  try {
    var data = JSON.stringify({
      cname: channelName,
      uid: uid,
      clientRequest: {},
    });

    var config = {
      method: 'post',
      url: `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Basic ZmEyNzBhZDgwNjI1NDVmOTgyYThlZTcxYmEwOTMwNWM6MTJkYmYwNmNiNTM3NGU5OGEwN2I2N2YxNzcyNTA4MTg=',
      },
      data: data,
    };
    let startResponse = await axios(config);
    console.log('startResponse.data -> ', startResponse.data);
    return startResponse.data;
  } catch (err) {
    throw err;
  }
};

router.post('/start', verifySession, async (req, res) => {
  try {
    const { channelName, uids, businessId } = req.body;

    const uid = getUid().toString();

    const acquireResponse = await acquireApiCall(channelName, uid);
    const resourceId = acquireResponse.resourceId;

    const startResponse = await startApiCall(
      channelName,
      resourceId,
      uid,
      uids,
      businessId
    );
    const sid = startResponse.sid;

    res.status(200).json({ resourceId, sid, uid });
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/stop', verifySession, async (req, res) => {
  try {
    const { channelName, uid, sid, resourceId, businessId, eventId } = req.body;

    const endResponse = await endApiCall(channelName, uid, sid, resourceId);

    const file = endResponse.serverResponse.fileList.find(i => i.fileName.includes(".mp4"))

    let eventRecordingObj = await EventRecording.create({
      file,
      link: `${process.env.AWS_DOWNLOAD_URL}${file.fileName}`,
      uid,
      businessId,
      eventId,
    });

    eventRecordingObj = eventRecordingObj.toJSON();

    res.status(200).json(eventRecordingObj);
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/list', verifySession, async (req, res) => {
  try {
    const { businessId } = req.body;

    const list = await EventRecording.find({businessId})

    res.status(200).json(list);
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
