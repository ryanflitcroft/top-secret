const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('top-secret-routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should not allow an unauthenticated user to insert an instance of Secret into secrets', async () => {
    const agent = request.agent(app);

    await UserService.signUp({
      email: 'ryan@defense.gov',
      password: 'password-3',
    });

    const res = await agent.post('/api/v1/secrets').send({
      title: 'Guess what...',
      description: '...thats what.',
      userId: expect.any(String),
    });

    expect(res.body).toEqual({
      message: 'You must be signed in',
      status: 401,
    });
  });

  it('should allow an authenticated user to post an instance of Secret into secrets', async () => {
    const agent = request.agent(app);

    await UserService.signUp({
      email: 'ryan@defense.gov',
      password: 'password-3',
    });

    await agent.post('/api/v1/users/sessions').send({
      email: 'ryan@defense.gov',
      password: 'password-3',
    });

    const res = await agent.post('/api/v1/secrets').send({
      title: 'Guess what...',
      description: '...thats what.',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'Guess what...',
      description: '...thats what.',
      createdAt: expect.any(String),
    });
  });

  it('should not allow an unauthenticated user to get data from secrets', async () => {
    const res = await request(app).get('/api/v1/secrets');

    expect(res.body).toEqual({
      message: 'You must be signed in',
      status: 401,
    });
  });

  it('should allow an authenticated user to get data from secrets', async () => {
    const agent = request.agent(app);

    await UserService.signUp({
      email: 'ryan@defense.gov',
      password: 'password-3',
    });

    await agent.post('/api/v1/users/sessions').send({
      email: 'ryan@defense.gov',
      password: 'password-3',
    });

    await agent.post('/api/v1/secrets').send({
      title: 'Guess what...',
      description: '...thats what.',
    });

    await agent.post('/api/v1/secrets').send({
      title: 'Whats your name',
      description: 'Whats your sign',
    });

    const res = await agent.get('/api/v1/secrets');

    expect(res.body).toEqual([
      {
        title: 'Guess what...',
        description: '...thats what.',
        createdAt: expect.any(String),
        id: expect.any(String),
      },
      {
        title: 'Whats your name',
        description: 'Whats your sign',
        createdAt: expect.any(String),
        id: expect.any(String),
      },
    ]);
  });
});
