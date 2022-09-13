const router = require('express').Router();
const axios = require('axios');
const User = require('../../../models/entities/user-schema');
const Business = require('../../../models/entities/business-schema');
const Agent = require('../../../models/entities/agent-schema');
const Callnow = require('../../../models/operations/call-now-schema');
const AgentFeedback = require('../../../models/operations/agent-feedback-schema');
const handleError = require('../../../error_handling/handler');
const verifySession = require('../auth/verifySession');

// Find an available agent
// Check if current time is not in their inactive hours
const findAgent = async (agents) => {
  let agent = null;
  const authorization =
    `${process.env.AGORA_CUSTOMER_ID}${process.env.AGORA_CUSTOMER_SECRET}`.toString(
      'base64'
    );
  const today = new Date();
  for (const a of agents) {
    try {
      const { data } = await axios.get(
        `https://api.agora.io/dev/v1/channel/user/${process.env.AGORA_APP_ID}/${a.channel}`,
        { Headers: { Authorization: `Basic ${authorization}` } }
      );
      if (data.success && !data.data.channel_exist) {
        let flag = false;
        const now = `${today.getHours()}:${today.getMinutes()}`;
        for (const hours of a.inactive_hours) {
          if (hours.start <= now && hours.end >= now) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          agent = a;
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  if (!agent) return Error('Agents unavailable at the moment');
  return agent;
};

// Call now
router.post('/', async (req, res) => {
  const { businessID, cred } = req.body;
  try {
    const business = await Business.findById(businessID)
      .select('agents agentsSubscribed')
      .populate({
        path: 'agents',
        select:
          'name channel working_days active_hours firebaseToken deviceToken',
      });

    if (!business) {
      return res.status(404).json({ error: 'Business does not exist' });
    }
    if (!business.agentsSubscribed) {
      return res
        .status(404)
        .json({ error: 'This business does not have agents!' });
    }

    const today = new Date();
    const day = today.getDay() + 1;
    const activeDay = business.agent_working_days.findOne((o) => o === day);
    if (!activeDay) return res.status(500).json({ error: 'Inactive day!' });
    const now = `${today.getHours()}:${today.getMinutes()}`;
    let flag = false;
    for (const hours of business.agent_active_hours) {
      if (hours.start <= now && hours.end >= now) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      return res.status(500).json({ error: 'Inactive hour!' });
    }

    findAgent(business.agents)
      .then(async (agent) => {
        const call = new Callnow({
          user: cred._id,
          business: businessID,
          status: 'pending',
        });
        await call.save();
        res.status(200).json({
          callID: call._id,
          agent: { name: agent.name, channel: agent.channel },
        });
      })
      .catch((e) => {
        res.status(500).json({ error: e.message });
      });
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Request Call Back
router.post('/callback', async (req, res) => {
  const { businessID, cred } = req.body;
  try {
    const user = await User.findOne({ phone: cred.phone });
    if (!user) return res.status(401).json({ error: 'Invalid User' });

    const business = await Business.findById(businessID);

    if (!business) {
      return res.status(404).json({ error: 'Business does not exist' });
    }

    const callback = new Callnow({
      business: businessID,
      user: user._id,
      status: 'callback',
    });
    await callback.save();
    res.status(200).json({ success: 'Requested callback!' });
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Provide Feed Back
router.post('/feedback', async (req, res) => {
  const { agentID, cred, details } = req.body;
  try {
    const user = await User.findOne({ phone: cred.phone });
    if (!user) return res.status(401).json({ error: 'Invalid User' });

    const agent = await Agent.findById(agentID);

    if (!agent) {
      return res.status(404).json({ error: 'Agent does not exist' });
    }

    const feedback = new AgentFeedback({
      agent: agentID,
      user: user._id,
      userFeedback: {
        CallExperience: details.callExperience,
        Quality: details.callQuality,
        ShoppingExperience: details.shoppingExperience,
      },
    });
    await feedback.save();
    res.status(200).json({ success: 'Feedback sent!' });
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
