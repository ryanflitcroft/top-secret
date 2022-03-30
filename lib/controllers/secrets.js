const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    const post = await Secret.insert(req.body);
    res.send(post);
  })

  .get('/', authenticate, async (req, res, next) => {
    const secrets = await Secret.getAll();
    res.send(secrets);
  });
