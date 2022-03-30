const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async signUp({ email, password }) {
    try {
      const passwordHash = bcrypt.hashSync(
        password,
        Number(process.env.SALT_ROUNDS)
      );

      return User.insert({
        email,
        passwordHash,
      });
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }

  static async signIn({ email, password }) {
    try {
      const user = await User.getUserByEmail(email);

      if (!user) throw new Error('Invalid email/password');
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid username/password');

      return user;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
