const moment = require('moment');
const axios = require('axios');
const router = require('express').Router();
const Store = require('../../models/entities/store-schema')
const createAppointment = require('../../routes/user/booking/controllers/create').createAppointment;
const OutboundCalls = require('../../models/operations/outbound-calls');

const twillo = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const webApi = process.env.DEEPLINK_WEBAPI;

router.post('/', async (req, res) => {
  try {
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const client = twillo(accountSid, authToken);
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const responceData = [];
    let flag = true;
    const outboundCallsData = req.body;
    if (!outboundCallsData || !outboundCallsData.users || !outboundCallsData.store || outboundCallsData.users.length === 0) {
      return res.status(400).json({
        message: 'Invalid request format',
        data: null,
      });
    }

    for (let i = 0; i < outboundCallsData.users.length; i++) {
      for (let j = 0; j < outboundCallsData.users.length; j++) {
        if (i != j) {
          if (
            flag &&
            outboundCallsData.users[i].date ==
              outboundCallsData.users[j].date &&
            outboundCallsData.users[i].time == outboundCallsData.users[j].time
          ) {
            flag = false;
            return res.status(400).json({
              message: 'Not allow same date and time multiple time!',
              data: null,
            });
          }
        }
      }
    }

        for (let i = 0; i < outboundCallsData.users.length; i++) {
            for (let j = 0; j < outboundCallsData.users.length; j++) {
                if(i!=j){                        
                    if(flag && outboundCallsData.users[i].date == outboundCallsData.users[j].date && outboundCallsData.users[i].time == outboundCallsData.users[j].time ){
                        flag = false;
                        return res.status(400).json({
                            message: 'Not allow same date and time multiple time!',
                            data: null
                        });
                    }
                }
            }
        }

        for (let i = 0; i < outboundCallsData.users.length; i++) {
            let hour = +outboundCallsData.users[i].time.split(":")[0];
            let minutes = +outboundCallsData.users[i].time.split(":")[1];
            if (!outboundCallsData.users[i].name) {
                return res.status(400).json({
                    message: 'Name is requird!',
                    data: null
                });
            } else if (!isNaN(outboundCallsData.users[i].name)) {
                return res.status(400).json({
                    message: 'Invalid Name!',
                    data: null
                });
            } else if (!outboundCallsData.users[i].mobile) {
                return res.status(400).json({
                    message: 'Mobile is requird!',
                    data: null
                });
            } else if (!phoneRegex.test(outboundCallsData.users[i].mobile)) {
                return res.status(400).json({
                    message: 'Invalid mobile!',
                    data: null
                });
            } else if (!outboundCallsData.users[i].date) {
                return res.status(400).json({
                    message: 'Date is requird!',
                    data: null
                });
            } else if (!moment(outboundCallsData.users[i].date, 'YYYY/MM/DD', true).isValid()) {
                return res.status(400).json({
                    message: 'Invalid Date formate, only allow YYYY/MM/DD formate!',
                    data: null
                });
            } else if (!outboundCallsData.users[i].time) {
                return res.status(400).json({
                    message: 'Time is requird!',
                    data: null
                });
            }else if (isNaN(hour) || hour < 0 || hour > 24) {
                return res.status(400).json({
                    message: 'Invalid Hors!',
                    data: null
                });
            }else if (isNaN(minutes) || minutes != '00' && minutes != 30) {
                return res.status(400).send({
                    message: 'Invalid minutes, only allowed 00 or 30 minutes!',
                    data: null
                });
            }
        }
        for (let i = 0; i < outboundCallsData.users.length; i++) {
            let requestDateTime = new Date(outboundCallsData.users[i].date + " " + outboundCallsData.users[i].time + ":00"); 
            await OutboundCalls.findOne({dateTime:requestDateTime, store: outboundCallsData.store}).then( async (data) => {
                if (data){    
                    if(flag){
                        flag = false;
                        return res.status(400).send({
                            message: "Date " + outboundCallsData.users[i].date + ", Time " + outboundCallsData.users[i].time + " slot is full",
                            data: null
                        });
                    }
                }
            });
        }
        console.log('flag -> ', flag)
        if (flag) {
          for (let i = 0; i < outboundCallsData.users.length; i++) {
            let requestDateTime = new Date(
              outboundCallsData.users[i].date +
                ' ' +
                outboundCallsData.users[i].time +
                ':00'
            );
            let storeData = await Store.findById(outboundCallsData.store).populate({
              path: 'business',
              select: 'display_name',
            })
            .select('name business');
            console.log('storeData -> ', storeData)

            outboundCallsData.users[i]['dateTime'] = requestDateTime;
            outboundCallsData.users[i]['store'] = outboundCallsData.store || "";
            await OutboundCalls.create(outboundCallsData.users[i]).then(
              async (createdData) => {
                const response = await axios.post(
                  `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${webApi}`,
                  {
                    dynamicLinkInfo: {
                      domainUriPrefix: 'https://shopoutuser.page.link',
                      link: `https://coshop.shopout.live/?type=invitation&invitationId=${createdData._id}`,
                      androidInfo: {
                        androidPackageName: 'com.shopout.user',
                      },
                    },
                  }
                );
                const { shortLink } = response.data;
                const sendMessage = await axios.post(
                  `https://2factor.in/API/V1/${process.env.TWO_FACTOR_KEY}/ADDON_SERVICES/SEND/TSMS`,
                  {
                    From: 'SHPOUT',
                    To: outboundCallsData.users[i].mobile,
                    TemplateName: 'Shopoutoutbound',
                    VAR1: `${storeData.business.display_name || ""}`,
                    VAR2: `${shortLink}`,
                  }
                );
                console.log('sendMessage -> ', sendMessage.data)
                // client.messages
                //   .create({
                //     body: `Your are invited for shop visit from <Store Name> Open link to accpet your invitation:- ${shortLink}`,
                //     from: fromNumber,
                //     to: `+91${outboundCallsData.users[i].mobile}`,
                //   })
                //   .then((message) => console.log(message));
                responceData.push(createdData);
              }
            );
          }
        }
      
    
    if (flag) {
      return res.status(201).json({
        message: 'Success',
        data: responceData,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: 'Internal Server Error',
      data: null,
    });
  }
});

router.post('/get-user-count', async (req, res) => {
  try {
    const outboundCallsData = req.body;
    if (!outboundCallsData) {
      return res.status(400).json({
        message: 'Invalid request format!',
        data: null,
      });
    }
    if (!outboundCallsData.date) {
      return res.status(400).json({
        message: 'Date is requird!',
        data: null,
      });
    }
    if (!moment(outboundCallsData.date, 'YYYY/MM/DD', true).isValid()) {
      return res.status(400).json({
        message: 'Invalid Date formate, only allow YYYY/MM/DD formate!',
        data: null,
      });
    }
    let existingData = await OutboundCalls.aggregate([
      {
        $match: {
          date: outboundCallsData.date,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
      {
        $group: {
          _id: '$time',
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    existingData = JSON.parse(JSON.stringify(existingData));
    const formatedRes = {};
    existingData.map((e) => {
      formatedRes[e._id] = e.count;
    });
    return res.status(200).json({
      message: 'Success',
      data: formatedRes,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      data: null,
    });
  }
});

router.post('/accept-invitation', async (req, res) => {
    try {
        const outboundCallsData = req.body;        
        if (!outboundCallsData) {
            return res.status(400).json({
                message: 'Invalid request format!',
                data: null
            });
        } else if (!outboundCallsData.id) {
            return res.status(400).json({
                message: 'id is requird!',
                data: null
            });
        } else if (!outboundCallsData.user) {
            return res.status(400).json({
                message: 'user is requird!',
                data: null
            });
        } 
        let invitationData = await OutboundCalls.findById(outboundCallsData.id);
        const time = invitationData.date + " " + invitationData.time
        const startTime = moment(time, "YYYY/MM/DD HH:mm").format("YYYY-MM-DDTHH:mm:00.00+05:30");
        const endTime = moment(time, "YYYY/MM/DD HH:mm").add(30, "minutes").format("YYYY-MM-DDTHH:mm:00.00+05:30");

        let bookingData = {
          store: invitationData.store,
          user: outboundCallsData.user,
          start: startTime,
          end: endTime,
          visitors: 1,
          assistance: false,
          product: 'tshirt',
          type: 'virtual',
        };

        return await createAppointment(req, res, bookingData)
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            data: error
        });
    }
});

router.post('/reject-invitation', async (req, res) => {
    try {
        const outboundCallsData = req.body;
        console.log('outboundCallsData -> ', outboundCallsData)
        if (!outboundCallsData) {
            return res.status(400).json({
                message: 'Invalid request format!',
                data: null
            });
        } else if (!outboundCallsData.id) {
            return res.status(400).json({
                message: 'id is requird!',
                data: null
            });
        }
        let response = await OutboundCalls.findByIdAndUpdate(outboundCallsData.id, {reason: outboundCallsData.reason}).then((res) => {return res});
        console.log("here res -> ", response);
        return res.status(200).json({
          response: 'Booking rejected successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            data: error
        });
    }
});
module.exports = router;
