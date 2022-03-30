const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async signUp({ email, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    return User.insert({
      email,
      passwordHash,
    });
  }

  static async signIn({ email, password }) {
    const user = await User.getUserByEmail(email);
    if (!user) throw new Error('Invalid email/password');

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);

    if (!passwordMatch) throw new Error('Invalid username/password');

    return user;
  }
};
