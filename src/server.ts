import app from '@/app';
import { logger } from '@/utils/logger';
import { MONGODB_URI, PORT } from '@config';
import connection from '@/databases';
import validateEnv from '@/utils/validateEnv';
import routes from './routes';
import songRoutes from './routes/audio.route'
// import videoRoutes from './routes/video.route'

// ROUTES
validateEnv();
connection(MONGODB_URI);

const version = '/v1';
routes.forEach((route) => {
  const path = version + route.path;
  app.use(path, route.func);
});
//


//audio
// app.use('/',songRoutes)

// app.use('/',videoRoutes)

// LISTEN PORT
app.listen(PORT, () => {
  logger.info(`·•· ·•· ·•· ·•· ·•· ·•· ·•· ·•· ·•·`);
  logger.warn(`App is running on http://localhost:${PORT}`);
  logger.info(`·•· ·•· ·•· ·•· ·•· ·•· ·•· ·•· ·•·`);
});

