const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router().post('/signup', async (req, res, next) => {
  try {
    const user = await UserService.signUp(req.body);

    res.json(user);
  } catch (error) {
    next(error);
  }
});
