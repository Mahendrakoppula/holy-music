import hpp from 'hpp';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import errorMiddleware from '@middlewares/error.middleware';
import { ORIGIN, CREDENTIALS } from '@config';
// EXPRESS APP
const app = express();
// CORS
const corsOptions = cors({
  origin: [ORIGIN],
  credentials: CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
});

// App Initialization
app.use(hpp());
app.use(helmet());
app.use(corsOptions);
app.use(compression());
app.use(express.json());
app.use(cookieParser());
// app.use(morgan(LOG_FORMAT, { stream }));
app.use(express.urlencoded({ extended: true }));
// Error Handling
app.use(errorMiddleware);
app.use(methodOverride('_method'));

export default app;
