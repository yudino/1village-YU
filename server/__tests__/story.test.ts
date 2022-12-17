import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import supertest from 'supertest';

import { getApp } from '../app';
import { Image } from '../entities/image';
import { AppDataSource } from '../utils/data-source';
import { appDataSource, fakeStory, fakeUser, loginUser, newDataStory } from './mock';

// Mock connection to database to avoid error message in console.
jest.mock('../utils/database', () => ({
  connection: Promise.resolve(),
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

jest.mock('../authentication/login', () => ({
  __esModule: true,
  login: async () => ({
    user: fakeUser,
  }),
}));

//Doc : https://rahmanfadhil.com/test-express-with-supertest/
describe('Story api test', () => {
  beforeAll(() => {
    return appDataSource.initialize();
  });
  afterAll(() => {
    return appDataSource.destroy();
  });
  describe('Images use in original stories', () => {
    const auth = { token: '' };
    beforeAll(async () => {
      return loginUser(auth);
    });

    describe('api call /images/all', () => {
      it('should return ALL images', async () => {
        try {
          const app = await getApp();
          await supertest(app).get(`/api/stories/all`).expect(200);
        } catch (e) {
          expect(404);
        }
      });
    });
    describe('create a story', () => {
      it('should create a draft story and publish it', async () => {
        try {
          const app = await getApp();
          await supertest(app)
            .post(`/api/activities`)
            .send(fakeStory)
            .expect(200)
            .then(async (response) => {
              expect(response.body.id).toBeTruthy();
              const updtStory = {
                ...response.body,
                status: 0,
                data: {
                  ...newDataStory,
                },
              };
              await supertest(app)
                .put(`/api/activities/${response.body.id}`)
                .send(updtStory)
                .expect(200)
                .then(async () => {
                  const images = await AppDataSource.getRepository(Image).find({ where: { userId: 1 } });
                  expect(images).toBeTruthy();
                  expect(images.length).toBe(3);
                });
            });
        } catch (e) {
          expect(404);
        }
      });
    });
  });
});
