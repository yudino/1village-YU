import { access } from 'fs';
import path from 'path';
import supertest from 'supertest';
import { DataSource } from 'typeorm';

import { getApp } from '../app';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [path.join(__dirname, '../entities/*.js')],
  synchronize: true,
  logging: false,
});

/**
 * function to create a token for the use of PLM's api
 * @param auth empty object with token string property
 * @returns auth with token inside
 */
export async function loginUser() {
  const app = await getApp();
  const response = await supertest(app)
    .post('/login')
    .send({
      username: 'teacher1@mail.io',
      password: 'helloWorld*',
    })
    .expect(200);
  // .end(function (err, res) {
  //   if (err) throw err;
  //   return res.body.accessToken;
  // });
  return response.body;
}
// export function loginUser() {
//   return async function () {
//     const app = await getApp();
//     supertest(app)
//       .post('/login')
//       .send({
//         username: 'teacher1@mail.io',
//         password: 'helloWorld*',
//       })
//       .expect(200)
//       .end(function (err, res) {
//         if (err) throw err;
//         return res.body.accessToken;
//       });
//   };
// }

/**
 * Mock for fake user to the response for login request
 */
export const fakeUser = {
  id: 1,
  email: 'teacher1@mail.io',
  pseudo: 'teacher1',
  level: 'CM1',
  school: 'École polyvalente publique Tandou',
  city: 'Paris',
  postalCode: '75019',
  address: '16 Rue Tandou, 75019 Paris',
  avatar: null,
  displayName: null,
  accountRegistration: 0,
  passwordHash: '$argon2i$v=19$m=16,t=2,p=1$cTY0aFpyUmF2ZkhERnRSQQ$j7XF79KQqmGGay1bqtxNuQ',
  firstLogin: 3,
  type: 0,
  villageId: 1,
  country: { isoCode: 'FR', name: 'France' },
  position: { lat: 48.8863442, lng: 2.380321 },
};

/**
 * Mock for the accessToken for User
 */

export const mockAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3MjI0NzE4NywiZXhwIjoxNjcyMjYxNTg3fQ.l95f56k9vtXqz1h9E7GUMxfMpVYKnXyyL_hzIjvsEbo';

export const fakeStory = {
  id: 0,
  type: 13,
  subType: undefined,
  status: 1,
  phase: 3,
  data: {
    object: {
      imageId: 0,
      imageUrl: '',
      description: '',
      inspiredStoryId: 0,
    },
    place: {
      imageId: 0,
      imageUrl: '',
      description: '',
      inspiredStoryId: 0,
    },
    odd: {
      imageId: 0,
      imageUrl: '',
      description: '',
      inspiredStoryId: 0,
    },
    tale: {
      imageId: 0,
      imageStory: '',
      tale: '',
    },
    isOriginal: false,
  },
  content: { id: 0, type: 'text', value: '' },
  userId: 1,
  isPinned: false,
  villageId: 1,
  responseActivityId: null,
  responseType: null,
};

export const newDataStory = {
  object: {
    imageId: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1671071402828-b59e9acb2cae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
    description: 'test objet',
    inspiredStoryId: 0,
  },
  place: {
    imageId: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1671055745403-1bb62dd7bcf8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
    description: 'test place',
    inspiredStoryId: 0,
  },
  odd: {
    imageId: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1671026423293-7adf6a6abd13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
    description: "ODD 6 : Accès à l'eau salubre et à l'assainissement",
    inspiredStoryId: 0,
  },
  tale: {
    imageId: 0,
    imageStory:
      'https://images.unsplash.com/photo-1670837302975-8db32a473643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
    tale: 'test tale',
  },
  isOriginal: true,
};
