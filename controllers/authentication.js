const njwt = require('njwt');
const bcrypt = require('bcryptjs');
const secureRandom = require('secure-random');
const { customAlphabet } = require('nanoid');
const User = require('../models/entities/user-schema');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// token setup
// highly random 256 byte array
const secureJWT = (phone, scope) => {
  const claims = {
    sub: phone,
    scope,
  };

  const key = secureRandom(256, { type: 'Buffer' });
  // expires in 7 days
  const jwt = njwt.create(claims, key);
  const expirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  jwt.setExpiration(expirationTime);

  const token = jwt.compact();
  return { token, key };
};

const createStub = async (userData) => {
  const refCode = customAlphabet(alphabet, 7);
  const referralCode = refCode();

  const hashedPassword = await bcrypt.hash(`shopout${userData.phone}`, 12);
  userData.referral = referralCode;
  userData.password = hashedPassword;

  const savedUser = await User.create(userData);

  return savedUser;
};

module.exports = { secureJWT, createStub };
