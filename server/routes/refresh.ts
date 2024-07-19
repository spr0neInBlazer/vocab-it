import express from 'express';
import refreshController from '../controllers/refreshController';

const refreshRouter = express.Router();

refreshRouter.get('/', refreshController);

export default refreshRouter;
