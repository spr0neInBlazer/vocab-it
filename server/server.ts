import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import mongoose from 'mongoose';
import connectDB from './db/connect';
const app: Application = express();
const PORT = process.env.PORT || 3500;

connectDB();

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
});
