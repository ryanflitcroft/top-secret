const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  //logged in users can post new secrets
  const post = await Secret.insert(req.body);
  res.send(post);
});
