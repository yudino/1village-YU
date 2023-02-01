import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { response } from 'express';
import supertest from 'supertest';

import { getApp } from '../app';
import { Image } from '../entities/image';
import { crsfProtection } from '../middlewares/csrfCheck';
import { AppDataSource } from '../utils/data-source';
import { appDataSource, fakeStory, fakeUser, loginUser, mockAccessToken, newDataStory } from './mock';

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

// Auxiliary function.
function createLoginToken(server, loginDetails, done) {
  supertest(server)
    .post('/login')
    .send(loginDetails)
    .end(function (error, response) {
      if (error) {
        throw error;
      }
      const loginToken = response.body.accessToken;
      done(loginToken);
    });
}

//Doc : https://rahmanfadhil.com/test-express-with-supertest/
describe('Story api test', () => {
  beforeAll(() => {
    return appDataSource.initialize();
  });
  afterAll(() => {
    return appDataSource.destroy();
  });
  describe('Images use in original stories', () => {
    // const auth = { accessToken: '' };
    // const cookie = crsfProtection();
    // beforeAll(async () => {
    //   return loginUser().then((response) => {
    //     auth.accessToken = response.accessToken;
    //   });
    // });
    //https://gist.github.com/MehdiGolchin/d2da56b3630ac185db9b
    //https://stackoverflow.com/questions/43634736/error-expected-200-ok-got-401-unauthorized-when-trying-to-login-using-moch
    describe('api call /images/all', () => {
      it('should return ALL images ', async () => {
        const app = await getApp();
        createLoginToken(
          app,
          {
            username: 'teacher1@mail.io',
            password: 'helloWorld*',
          },
          function (header: string) {
            supertest(app)
              .get(`/api/stories/all?villageId=${fakeUser.villageId}`)
              .set('Authorization', header)
              .expect(200)
              .expect((res) => {
                console.log(res);
                expect(res.body.length).toBe(2);
                expect(res.body).toMatchObject({
                  objects: [],
                  odds: [],
                  places: [],
                });
                // {
                // "objects": [],
                // "odds": [],
                // "places": []
                // }
              });
          },
        );
      });

      it('should NOT return ALL images with wrong endpoint', async () => {
        const app = await getApp();
        await supertest(app).get(`/api/storyyy/all`).expect(404);
      });
    });
    // describe('create a story', () => {
    //   it('should create a draft story and publish it', async () => {
    //     try {
    //       const app = await getApp();
    //       await supertest(app)
    //         .post(`/api/activities`)
    //         .send(fakeStory)
    //         .expect(200)
    //         .then(async (response) => {
    //           expect(response.body.id).toBeTruthy();
    //           const updtStory = {
    //             ...response.body,
    //             status: 0,
    //             data: {
    //               ...newDataStory,
    //             },
    //           };
    //           await supertest(app)
    //             .put(`/api/activities/${response.body.id}`)
    //             .send(updtStory)
    //             .expect(200)
    //             .then(async () => {
    //               const images = await AppDataSource.getRepository(Image).find({ where: { userId: 1 } });
    //               expect(images).toBeTruthy();
    //               expect(images.length).toBe(3);
    //             });
    //         });
    //     } catch (e) {
    //       console.log(e);
    //       // expect(404);
    //     }
    //   });
    // });
  });
});
