import express from 'express';
import {deleteAccount, getProfile, updateUsername, updateWordsPerLesson} from '../controllers/profileController';

const profileRouter = express.Router();

profileRouter.get('/', getProfile);
profileRouter.put('/updateUsername', updateUsername);
profileRouter.put('/updateWordsPer', updateWordsPerLesson);
profileRouter.delete('/deleteAccount', deleteAccount);

export default profileRouter;
