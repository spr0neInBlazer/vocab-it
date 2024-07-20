import express from 'express';
import {
  addVocab, 
  deleteVocab, 
  getVocab, 
  updateTitle
} from '../controllers/vocabController';
import { addWord } from '../controllers/wordController';

const vocabRouter = express.Router();

vocabRouter.post('/addVocab', addVocab);
vocabRouter.post('/getVocab', getVocab);
vocabRouter.put('/updateTitle', updateTitle);
vocabRouter.delete('/deleteVocab', deleteVocab);
vocabRouter.post('/addWord', addWord);

export default vocabRouter;