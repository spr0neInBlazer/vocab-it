"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vocabController_1 = require("../controllers/vocabController");
const wordController_1 = require("../controllers/wordController");
const vocabRouter = express_1.default.Router();
vocabRouter.get('/getVocabs', vocabController_1.getVocabs);
vocabRouter.post('/addVocab', vocabController_1.addVocab);
vocabRouter.post('/getVocab', vocabController_1.getVocab);
vocabRouter.patch('/updateTitle', vocabController_1.updateTitle);
vocabRouter.delete('/deleteVocab', vocabController_1.deleteVocab);
vocabRouter.post('/addWord', wordController_1.addWord);
vocabRouter.patch('/updateWord', wordController_1.updateWord);
vocabRouter.patch('/deleteWord', wordController_1.deleteWord);
vocabRouter.patch('/deleteWords', wordController_1.deleteAllWords);
vocabRouter.post('/importCsv', wordController_1.addCSV);
vocabRouter.patch('/updateProgress', wordController_1.updateProgress);
exports.default = vocabRouter;
