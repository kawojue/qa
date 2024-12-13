import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), './.env'),
});

export const config = {
  port: parseInt(process.env.PORT, 10) || 8080,
  db: {
    url: process.env.DATABASE_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY,
  },
  plunk: {
    apiKey: process.env.PLUNK_API_KEY,
  },
};
