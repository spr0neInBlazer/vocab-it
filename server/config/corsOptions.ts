import allowedOrigins from "./allowedOrigins";
import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
}