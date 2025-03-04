import { Router } from 'express';

import { activityController } from './activity';
import { analyticController } from './analytic';
import { archiveController } from './archive';
import { audioController } from './audio';
import { countryController } from './countries';
import { currencyController } from './currencies';
import { gameController } from './game';
import { imageController } from './image';
import { languageController } from './languages';
import { storyController } from './story';
import { userController } from './user';
import { videoController } from './video';
import { villageController } from './village';
import { weatherController } from './weather';
import { xapiController } from './xapi';

const controllerRouter = Router();
const controllers = [
  languageController,
  currencyController,
  userController,
  villageController,
  countryController,
  activityController,
  gameController,
  imageController,
  audioController,
  videoController,
  analyticController,
  archiveController,
  weatherController,
  storyController,
  xapiController,
];

for (let i = 0, n = controllers.length; i < n; i++) {
  controllerRouter.use(controllers[i].name, controllers[i].router);
}

export { controllerRouter };
