import { config } from 'dotenv';
const dev = process.env.NODE_ENV !== 'production';
config({ path: `.env.${dev ? 'development' : process.env.NODE_ENV}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  AudioUrlBase,
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRY,
  FORGET_PASSWORD_EXPIRE,
  BASE_URL,
  DB_NAME,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID,
} = process.env;
