// --- Load environment variables ---
// eslint-disable-next-line arca/newline-after-import-section
import { config } from 'dotenv';
config();

// eslint-disable-next-line arca/import-ordering
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import type { Response, RequestHandler } from 'express';
import express, { Router } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import next from 'next';
import path from 'path';
import type { Connection } from 'typeorm';

import { authRouter } from './authentication';
import { controllerRouter } from './controllers';
import { UserType } from './entities/user';
import { authenticate } from './middlewares/authenticate';
import { crsfProtection } from './middlewares/csrfCheck';
import { handleErrors } from './middlewares/handleErrors';
import { jsonify } from './middlewares/jsonify';
import { setVillage } from './middlewares/setVillage';
import { removeTrailingSlash } from './middlewares/trailingSlash';
import { connectToDatabase } from './utils/database';
import { logger } from './utils/logger';
import { onError, normalizePort, getDefaultDirectives } from './utils/server';

const isDevENV = process.env.NODE_ENV !== 'production';
const frontendHandler = next({ dev: isDevENV });
const handle = frontendHandler.getRequestHandler();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 600, // Limit each IP to 600 requests per `window` (here, per minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

async function start() {
  // Connect to DB
  const connection: Connection | null = await connectToDatabase();
  if (connection === null) {
    throw new Error('Could not connect to database...');
  }
  logger.info(`Database connection established: ${connection.isConnected}`);

  // Prepare frontend routes
  await frontendHandler.prepare();

  // [1] --- Init express ---
  const app = express();
  app.enable('strict routing');

  // [2] --- Add the middlewares ---
  const directives = getDefaultDirectives();
  if (isDevENV) {
    directives['default-src'] = ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https:'];
    directives['script-src'] = ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https:', 'blob:'];
  }
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives,
      },
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(limiter);
  app.use(cors() as RequestHandler);
  app.use(removeTrailingSlash);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(crsfProtection());

  // [3] --- Add authentication router ---
  app.use('/', authRouter);

  // [4] --- Add backend API ---
  const backRouter = Router();
  backRouter.use(
    morgan(isDevENV ? 'dev' : 'combined', {
      skip: (req) => req.baseUrl.slice(0, 14) === '/api/analytics',
    }),
  );
  backRouter.use(jsonify);
  backRouter.get('/', (_, res: Response) => {
    res.status(200).send('Hello World 1Village!');
  });
  backRouter.use(controllerRouter);
  backRouter.use((_, res: Response) => {
    res.status(404).send('Error 404 - Not found.');
  });
  app.use('/api', backRouter);

  // [5] --- Add frontend ---
  app.get('/country-flags/*', handleErrors(authenticate(UserType.TEACHER)), express.static(path.join(__dirname, '../../public/country-flags')));
  app.use(express.static(path.join(__dirname, '../../public'))); // app.js is located at ./dist/server and public at ./public
  app.get('/_next/*', (req, res) => {
    handle(req, res).catch((e) => console.error(e));
  });
  app.get(
    '*',
    morgan(isDevENV ? 'dev' : 'combined'),
    handleErrors(authenticate()),
    handleErrors(setVillage),
    handleErrors(async (req, res) => {
      if (req.user === undefined && req.path !== '/login' && req.path !== '/') {
        res.redirect('/login');
        return;
      }
      if (req.path.slice(1, 6) === 'admin' && (!req.user || req.user.type < UserType.ADMIN)) {
        res.redirect('/');
        return;
      }
      req.csrfToken = req.getCsrfToken();
      await handle(req, res);
    }),
  );

  // [6] --- Last fallback ---
  app.use(morgan(isDevENV ? 'dev' : 'combined'), (_, res: Response) => {
    res.status(404).send('Error 404 - Not found.');
  });

  // [7] --- Start server ---
  const port = normalizePort(process.env.PORT || '5000');
  const server = app.listen(port);
  server.on('error', onError);
  server.on('listening', () => {
    logger.info(`App listening on port ${port}!`);
  });
}

start().catch((e: Error) => {
  console.error(e);
  process.exit(0);
});
