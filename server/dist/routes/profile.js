import express from 'express';
import { deleteAccount, getProfile, updateUsername, } from '../controllers/profileController.js';
const profileRouter = express.Router();
profileRouter.get('/', getProfile);
profileRouter.patch('/updateUsername', updateUsername);
profileRouter.delete('/deleteAccount', deleteAccount);
export default profileRouter;
