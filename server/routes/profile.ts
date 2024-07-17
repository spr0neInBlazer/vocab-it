import express from 'express';
import verifyJWT from '../middleware/verifyJWT';
import profileController from '../controllers/profileController';

const profileRouter = express.Router();

profileRouter.get('/', profileController);

export default profileRouter;
