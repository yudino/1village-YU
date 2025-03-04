import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';

import { UserType } from '../entities/user';
import { Village } from '../entities/village';
import { createVillagesFromPLM } from '../legacy-plm/api';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { valueOrDefault } from '../utils';
import { AppDataSource } from '../utils/data-source';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { Controller } from './controller';

const villageController = new Controller('/villages');

//--- Get all villages ---
villageController.get({ path: '', userType: UserType.OBSERVATOR }, async (_req: Request, res: Response) => {
  const villages = await AppDataSource.getRepository(Village).find();
  res.sendJSON(villages);
});

//--- Get one village ---
villageController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const id = parseInt(req.params.id, 10) || 0;
  const village = await AppDataSource.getRepository(Village).findOne({ where: { id } });
  if (!village || (req.user.type === UserType.TEACHER && req.user.villageId !== village.id)) {
    next();
    return;
  }
  res.sendJSON(village);
});

//--- Create a village ---
type CreateVillageData = {
  name: string;
  countries: string[];
};
const CREATE_SCHEMA: JSONSchemaType<CreateVillageData> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    countries: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 2, uniqueItems: true },
  },
  required: ['name', 'countries'],
  additionalProperties: false,
};
const createVillageValidator = ajv.compile(CREATE_SCHEMA);
villageController.post({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const data = req.body;
  if (!createVillageValidator(data)) {
    sendInvalidDataError(createVillageValidator);
    return;
  }
  const village = new Village();
  village.name = data.name;
  village.countryCodes = data.countries;
  await AppDataSource.getRepository(Village).save(village);
  res.sendJSON(village);
});

//--- Update a village ---
type UpdateVillageData = {
  name?: string;
  countries?: string[];
  activePhase?: number;
  anthemId?: number;
};
const UPDATE_SCHEMA: JSONSchemaType<UpdateVillageData> = {
  type: 'object',
  properties: {
    name: { type: 'string', nullable: true },
    countries: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 2, uniqueItems: true, nullable: true },
    activePhase: { type: 'number', nullable: true },
    anthemId: { type: 'number', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
const updateVillageValidator = ajv.compile(UPDATE_SCHEMA);
villageController.put({ path: '/:id', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!updateVillageValidator(data)) {
    sendInvalidDataError(updateVillageValidator);
    return;
  }
  const id = parseInt(req.params.id, 10) || 0;
  const village = await AppDataSource.getRepository(Village).findOne({ where: { id } });
  if (!village) {
    next();
    return;
  }

  village.name = valueOrDefault(data.name, village.name);
  village.countryCodes = valueOrDefault(data.countries, village.countryCodes);
  village.activePhase = valueOrDefault(data.activePhase, village.activePhase);
  village.anthemId = valueOrDefault(data.anthemId, village.anthemId);

  await AppDataSource.getRepository(Village).save(village);
  res.sendJSON(village);
});

//--- delete a village ---
villageController.delete({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 0;
  await AppDataSource.getRepository(Village).delete({ id });
  res.status(204).send();
});

//--- import ParLeMonde villages ---
villageController.post({ path: '/import/plm', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const count = await createVillagesFromPLM();
  if (count === null) {
    throw new AppError('Unkown error', ErrorCode.UNKNOWN);
  }
  res.sendJSON({ success: true, count });
});

export { villageController };
