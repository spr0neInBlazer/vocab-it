import express from 'express';
import {
  addVocab, 
  deleteVocab, 
  getVocab, 
  getVocabs, 
  updateLang, 
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
vocabRouter.patch('/updateTitle', updateTitle);
vocabRouter.patch('/updateLang', updateLang);
vocabRouter.delete('/deleteVocab', deleteVocab);
vocabRouter.post('/addWord', addWord);
vocabRouter.patch('/updateWord', updateWord);
vocabRouter.patch('/deleteWord', deleteWord);
vocabRouter.patch('/deleteWords', deleteAllWords);
vocabRouter.post('/importCsv', addCSV);
vocabRouter.patch('/updateProgress', updateProgress);

export default vocabRouter;