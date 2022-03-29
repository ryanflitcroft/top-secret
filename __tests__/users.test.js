const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('top-secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to create a user', async () => {
    const res = await request(app).post('/api/v1/users').send({
      email: 'ryan@defense.gov',
      password: 'password-3',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'ryan@defense.gov',
    });
  });

  it('should be able to sign in an existing user', async () => {
    const user = await UserService.signUp({
      email: 'ryan@defense.gov',
      password: 'password-3',
    });

    const res = await request(app).post('/api/v1/users/sessions').send({
      email: 'ryan@defense.gov',
      password: 'password-3',
    });

    expect(res.body).toEqual({
      message: 'Successfully signed in!',
      user,
    });
  });
});
