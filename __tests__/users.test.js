const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('top-secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to create a user', async () => {
    const res = await request(app).post('/api/v1/users/signup').send({
      email: 'ryan@defense.gov',
      password: 'password-3',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'ryan@defense.gov',
    });
  });
});
