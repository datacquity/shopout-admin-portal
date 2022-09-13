const njwt = require('njwt');
const Store = require('../../../models/entities/store-schema');
const Agent = require('../../../models/entities/agent-schema');
const handleError = require('../../../error_handling/handler');

// =====================================
// AUTH SETUP
// session verification middleware
const verifySession = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  const token = (req.headers.authorization || '').split(' ')[1];
  const { type, loginID, phone } = req.body.cred || {};

  

  req.loginID = loginID;
  if (type.toLowerCase() === 'store' && phone) {
    if (!phone) {
      return res.status(400).json({ error: 'Invalid request format.' });
    }
    Store.findOne({ phone }, (err, store) => {
      if (err) {
        handleError(err);
        return res.status(500).json({ error: 'Internal server error' });
      } else {
        if (store) {
          njwt.verify(token, store._signingKey, (err, verifiedJwt) => {
            if (err) {
              handleError(err);
              return res.status(401).json({ error: 'Unauthorized access' });
            } else {
              if (
                verifiedJwt.body.scope === 'store' ||
                verifiedJwt.body.scope === 'admin'
              ) {
                return next();
              }

              handleError('Forbidden scope');
              return res.status(403).json({ error: 'Forbidden Scope' });
            }
          });
        } else {
          handleError('Store not found');
          return res.status(404).json({ error: 'Store not found' });
        }
      }
    });
  } else if (type.toLowerCase() === 'agent' && loginID) {
    console.log("agent");
    console.log("loginID -> ", loginID);
    if (!loginID) {
      return res.status(400).json({ error: 'Invalid request format.' });
    }
    Agent.findOne({ loginID }, (err, agent) => {
      if (err) {
        handleError(err);
        return res.status(500).json({ error: 'Internal server error' });
      } else {
        if (agent) {
          njwt.verify(token, agent._signingKey, (err, verifiedJwt) => {
            if (err) {
              handleError(err);
              return res.status(401).json({ error: 'Unauthorized access' });
            } else {
              if (
                verifiedJwt.body.scope === 'agent' ||
                verifiedJwt.body.scope === 'admin'
              ) {
                return next();
              }

              handleError('Forbidden scope');
              return res.status(403).json({ error: 'Forbidden Scope' });
            }
          });
        } else {
          handleError('Store not found');
          return res.status(404).json({ error: 'Store not found' });
        }
      }
    });
  }

  // return res.status(500).json({ error: 'Internal server error.' });
};

module.exports = verifySession;
