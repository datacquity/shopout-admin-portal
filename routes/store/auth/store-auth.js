const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Store = require('../../../models/entities/store-schema');
const Agent = require('../../../models/entities/agent-schema');
const Notification = require('../../../models/operations/notification-schema');
const authentication = require('../../../controllers/authentication');
const handleError = require('../../../error_handling/handler');
const verification = require('./verification');
// const Business = require('../../../models/entities/business-schema');

console.log(verification);

router.use('/verify', verification);
/* ******************************************
 *  APPLICATION ACTIONS
 */

/*
11-01-2022
Added type to the request body to check for Agent or Store
*/

router.post('/reset/password', async (req, res) => {
  try {
    const { cred, type } = req.body;
    if (!cred) {
      return res.status(400).json('Invalid request format.');
    }

    const hashedPassword = await bcrypt.hash(cred.password, 12);

    if (type.toLowerCase() === 'store') {
      await Store.findOneAndUpdate(
        { phone: cred.phone },
        { password: hashedPassword }
      );
    } else if (type.toLowerCase() === 'agent') {
      await Agent.findOneAndUpdate(
        { loginID: cred.loginID },
        { password: hashedPassword }
      );
    }

    return res.status(200).json({ response: 'Success' });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Find the type - Store or Agent
router.post('/type', async (req, res) => {
  try {
    const { cred } = req.body;

    if (!cred) {
      return res.status(400).json({ error: 'Invalid request format.' });
    }

    const agent = await Agent.findOne({
      loginID: cred.userID,
    });

    if (agent) {
      return res.status(200).json({
        type: 'Agent',
      });
    }

    const store = await Store.findOne({ phone: cred.userID });
    if (store) {
      return res.status(200).json({ type: 'Store' });
    }

    return res.status(400).json({ error: 'Invalid details!' });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

//Agent Register
router.post('/agent/register', async(req,res) => {
  try{
    const {agentData} = req.body;

    // const business = await Business.find({name : {$exists : true}}, (err,foundBusiness)=>{
        
    // }).select("name ");
    // // res.json({success : "true" , business : business});

    bcrypt.hash(agentData.password , 12).then((hashedPassword)=>{
      let newAgent = new Agent({
        business : agentData.business,
        password : hashedPassword,
        name : agentData.name,
        loginID : agentData.loginID,
        inactive_hours : [
          {
            start : agentData.start,
            end : agentData.end,
          },
        ],
      });
      newAgent.save((err,savedAgent)=>{
        if (err){
          console.error("Error before finding store", err);
        }
        else{
          console.log("Saved a store");
        }
        res.status(200).json({success : "New Agent is Created" , agent : newAgent});
      })
    })
  }
  catch(e){
    console.log(e);
  }
});

// Agent Login
router.post('/agent/login', async (req, res) => {
  try {
    const { cred } = req.body;

    if (!cred) {
      return res.status(400).json({ error: 'Invalid request format.' });
    }
    const generatedKey = authentication.secureJWT(cred.phone, 'agent');

    const agent = await Agent.findOneAndUpdate(
      { loginID: cred.loginID },
      { _signingKey: generatedKey.key, firebaseToken: cred.firebaseToken }
    )
      .populate({
        path: 'notifications',
        populate: {
          path: 'user',
          select: 'firstName lastName avatar',
        },
        options: {
          limit: 15,
          sort: { generatedTime: -1 },
        },
      })
      .populate({
        path: 'business',
        select: 'display_name images title_image email tags',
      })
      .select('-notificationHistory');

      console.log('agent._signingKey -> ', agent._signingKey)
    
    if (!agent) {
      handleError('Login ID not registered');
      return res.status(404).json({ error: 'Login ID not registered' });
    }

    const match = await bcrypt.compare(cred.password, agent.password);

    if (!match) {
      handleError('Invalid password');
      return res.status(404).json({ error: 'Invalid password' });
    }

    // if (agent._signingKey) {
    //   return res.status(404).json({ error: 'Agent is already logged in' });
    // }

    return res.status(200).json({
      token: generatedKey.token,
      agent,
    });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Store Login
router.post('/login', async (req, res) => {
  try {
    const { cred } = req.body;

    if (!cred) {
      return res.status(400).json({ error: 'Invalid request format.' });
    }
    const generatedKey = authentication.secureJWT(cred.phone, 'store');

    const store = await Store.findOneAndUpdate(
      { phone: cred.phone },
      { _signingKey: generatedKey.key, firebaseToken: cred.firebaseToken }
    )
      .populate({
        path: 'notifications',
        populate: {
          path: 'user',
          select: 'firstName lastName avatar',
        },
        options: {
          limit: 15,
          sort: { generatedTime: -1 },
        },
      })
      .populate({
        path: 'business',
        select: 'display_name images title_image email tags',
      })
      .select(
        '-bookings -slots -archiveBookings -images -reviews -notificationHistory -video_slots -parameters -_signingKey'
      );

    if (!store) {
      handleError('Phone number not registered');
      return res.status(404).json({ error: 'Phone number not registered' });
    }

    const match = await bcrypt.compare(cred.password, store.password);

    if (!match) {
      handleError('Invalid password');
      return res.status(404).json({ error: 'Invalid password' });
    }

    return res.status(200).json({
      token: generatedKey.token,
      store,
    });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// delete tokens on logout
// type = "agent" | "store"
router.post('/logout', async (req, res) => {
  try {
    let { cred, type } = req.body;

    type = type || cred.type;

    if (!cred) {
      return res.status(400).json({
        error: 'Invalid request format.',
      });
    }

    // Store or Agent
    if (type.toLowerCase() === 'store') {
      const store = await Store.findOneAndUpdate(
        { phone: cred.phone },
        {
          _signingKey: '',
          firebaseToken: '',
        }
      );

      if (!store) {
        return res.status(500).json({
          error: 'Server error',
        });
      }
    } else if (type.toLowerCase() === 'agent') {
      console.log('agent -> ')
      const agent = await Agent.findOneAndUpdate(
        { loginID: cred.loginID },
        {
          _signingKey: null,
          firebaseToken: '',
        }
      ).exec();

      console.log('agent -> ', agent)

      if (!agent) {
        return res.status(500).json({
          error: 'Server error',
        });
      }
    }

    return res.status(200).json({
      response: 'Agent Successfully logged out',
    });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
