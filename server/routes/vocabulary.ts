import express from 'express';
import {
  addVocab, 
  deleteVocab, 
  getVocab, 
  getVocabs, 
  updateTitle
} from '../controllers/vocabController';
import { 
  addCSV,
  addWord, 
  deleteAllWords, 
  deleteWord, 
  updateProgress, 
  updateWord
} from '../controllers/wordController';

const vocabRouter = express.Router();

vocabRouter.get('/getVocabs', getVocabs);
vocabRouter.post('/addVocab', addVocab);
vocabRouter.post('/getVocab', getVocab);
vocabRouter.put('/updateTitle', updateTitle);
vocabRouter.delete('/deleteVocab', deleteVocab);
vocabRouter.post('/addWord', addWord);
vocabRouter.put('/updateWord', updateWord);
vocabRouter.delete('/deleteWord', deleteWord);
vocabRouter.delete('/deleteWords', deleteAllWords);
vocabRouter.put('/importCsv', addCSV);
vocabRouter.put('/updateProgress', updateProgress);

export default vocabRouter;