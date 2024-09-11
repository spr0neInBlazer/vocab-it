import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './db/connect.js';
import compression from 'compression';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import { corsOptions } from './config/corsOptions.js';
import credentials from './middleware/credentials.js';
import cookieParser from 'cookie-parser';
import registerRouter from './routes/register.js';
import authRouter from './routes/auth.js';
import logoutRouter from './routes/logout.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import verifyJWT from './middleware/verifyJWT.js';
import profileRouter from './routes/profile.js';
import refreshRouter from './routes/refresh.js';
import notFoundMiddleware from './middleware/notFound.js';
import vocabRouter from './routes/vocabulary.js';
const app = express();
const PORT = process.env.PORT || 3500;
connectDB();
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
});
app.use(compression());
app.use(helmet());
app.use(limiter);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/logout', logoutRouter);
app.use('/refresh', refreshRouter);
// Protected routes
app.use('/profile', verifyJWT, profileRouter);
app.use('/vocabs', verifyJWT, vocabRouter);
app.all('*', notFoundMiddleware);
app.use(errorHandlerMiddleware);
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
});
