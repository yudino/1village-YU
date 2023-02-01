import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import supertest from 'supertest';

import { getApp } from '../app';
import { appDataSource, fakeUser, mockAccessToken } from './mock';

// Mock connection to database to avoid error message in console.
jest.mock('../utils/database', () => ({
  __esModule: true,
  connectToDatabase: async () => true,
}));

// Mock nodemailer to avoid message in console.
jest.mock('../emails/nodemailer', () => ({
  __esModule: true,
  getNodeMailer: async () => ({
    t: null,
  }),
}));

// Mock frontend NextJS library. We don't need it for testing.
jest.mock('next', () => ({
  __esModule: true,
  default: () => ({
    getRequestHandler: () => (_req: ExpressRequest, res: ExpressResponse) => {
      res.sendJSON({ isFrontend: true });
    },
    prepare: () => Promise.resolve(),
  }),
}));

//Mock response to login endpoint
jest.mock('../authentication/login', () => ({
  __esModule: true,
  login: async (_req: ExpressRequest, res: ExpressResponse) => {
    res.sendJSON({ user: fakeUser, accessToken: mockAccessToken, refreshToken: '' });
  },
}));

describe('test entry point', () => {
  beforeAll(() => {
    return appDataSource.initialize();
  });
  afterAll(() => {
    return appDataSource.destroy();
  });
  describe('server and login', () => {
    describe('server is OK', () => {
      it('should return 200', async () => {
        const app = await getApp();
        await supertest(app).get('/api').expect(200);
      });
    });

    describe('Login is', () => {
      it('should return 200', async () => {
        const app = await getApp();
        const response = await supertest(app)
          .post('/login')
          .send({
            username: 'teacher1@mail.io',
            password: 'Admin1234',
          })
          .set('Accept', 'application/json');
        expect(response.status).toBe(200);
      });
    });
  });
});
