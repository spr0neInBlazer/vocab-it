import express from 'express';
import refreshController from '../controllers/refreshController.js';
const refreshRouter = express.Router();
refreshRouter.post('/', refreshController);
export default refreshRouter;
