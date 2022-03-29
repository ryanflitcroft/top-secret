const { Router } = require('express');
const UserService = require('../services/UserService');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.signUp(req.body);

      res.json(user);
    } catch (error) {
      next(error);
    }
  })
  .post('/signin', async (req, res, next) => {
    try {
      const user = await UserService.signIn(req.body);

      res
        .cookie(process.env.COOKIE_NAME, user.authToken(), {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .send({ message: 'Successfully signed in!', user });
    } catch (error) {
      next(error);
    }
  });
