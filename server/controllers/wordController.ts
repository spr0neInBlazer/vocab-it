import { Request, Response } from "express";
import Vocabulary from "../models/Vocabulary";
import { v4 as uuidv4 } from 'uuid';
import { UserAnswer, Word } from "../types";

async function addWord(req: Request, res: Response) {
  try {
    const { vocabId, word, translation } = req.body;
    if (!word || !translation) {
      return res.status(400).json({ msg: 'Invalid word properties' });
    }

    const vocabToUpdate = await Vocabulary.findById(vocabId).exec();
    const duplicate = vocabToUpdate.words.find(w => w.word === word);
    if (duplicate) {
      return res.status(409).json({ msg: 'This word is already in the vocabulary' });
    }

    const newWord: Word = {
      _id: uuidv4(),
      word,
      translation,
      trained: 0,
      progress: 0
    };
    vocabToUpdate.words = [...vocabToUpdate.words, newWord];
    await vocabToUpdate.save();
    res.status(201).json(vocabToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function updateWord(req: Request, res: Response) {
  try {
    const { vocabId, wordId, word, translation } = req.body;
    if (!word || !translation) {
      return res.status(400).json({ msg: 'Invalid word properties' });
    }

    const vocabToUpdate = await Vocabulary.findById(vocabId).exec();
    if (!vocabToUpdate) {
      return res.status(404).json({ msg: 'Vocabulary not found' });
    }

    const duplicate = vocabToUpdate.words.find(w => w.word === word);
    if (!duplicate) {
      return res.status(409).json({ msg: 'The word does not exist in the vocabulary' });
    }

    const wordToUpdate = vocabToUpdate.words.find(w => w._id === wordId);
    if (!wordToUpdate) {
      return res.status(404).json({ msg: 'Word not found' });
    }
    
    wordToUpdate.word = word;
    wordToUpdate.translation = translation;
    await vocabToUpdate.save();
    res.status(200).json(vocabToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function deleteWord(req: Request, res: Response) {
  try {
    const { vocabId, wordId } = req.body;
    const vocabToUpdate = await Vocabulary.findById(vocabId).exec();
    if (!vocabToUpdate) {
      return res.status(404).json({ msg: 'Vocabulary not found' });
    }

    const wordIdx = vocabToUpdate.words.findIndex(w => w._id === wordId);
    if (wordIdx === -1) {
      return res.status(404).json({ msg: 'Word not found' });
    }

    const updatedWords = [...vocabToUpdate.words.slice(0, wordIdx), ...vocabToUpdate.words.slice(wordIdx + 1)];
    vocabToUpdate.words = updatedWords;
    await vocabToUpdate.save();
    res.status(200).json(vocabToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function deleteAllWords(req: Request, res: Response) {
  try {
    if (!req.body._id) {
      return res.status(400).json({ msg: '_id property not found'});
    }

    const vocabToUpdate = await Vocabulary.findByIdAndUpdate(req.body._id, { words: []}, {new: true});
    if (!vocabToUpdate) {
      return res.status(404).json({ msg: 'Vocabulary not found' });
    }

    res.status(200).json(vocabToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function addCSV(req: Request, res: Response) {
  try {
    const { words, vocabId } = req.body;
    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ msg: 'Invalid words array' });
    }

    const foundVocab = await Vocabulary.findById(vocabId).exec();
    if (!foundVocab) {
      return res.status(404).json({ msg: 'Vocabulary not found' });
    }
    
    // check for invalid word-translation pairs and duplicates
    const validatedWords: Word[] = words
      .filter(w => w.word && w.translation && !foundVocab.words.find(fvw => fvw.word === w.word))
      .map(w => ({ ...w, _id: uuidv4(), progress: 0, times: 0 }));

    if (validatedWords.length === 0) {
      return res.status(409).json({ msg: 'No valid new words to add' });
    }
    
    foundVocab.words.push(...validatedWords);
    await foundVocab.save();
    res.status(200).json(foundVocab);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function updateProgress(req: Request, res: Response) {
  try {
    const { answers, vocabId } = req.body;
    if (!answers || !vocabId) {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    const foundVocab = await Vocabulary.findById(vocabId).exec();
    if (!foundVocab) {
      return res.status(404).json({ msg: 'Vocabulary not found' });
    }

    answers.forEach((w: UserAnswer) => {
      const currWord = foundVocab.words.find(word => word._id === w._id);
      if (currWord) {
        currWord.trained = currWord.trained + 1;
        const isGuessCorrect = currWord.word === w.userAnswer;
        currWord.progress = getProgressPercentage(currWord.progress, currWord.trained, isGuessCorrect);
      }
    });

    await foundVocab.save();
    const { _id, title, words } = foundVocab;
    res.status(200).json({ _id, title, words });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

function getProgressPercentage(prev: number, trained: number, isCorrect: boolean): number {
  let result: number;
  const x = 100/(trained - 1);
  const y = prev / x;
  const z = 100 / trained;

  if (isCorrect) {
    result = trained === 1 ? 100 : Math.floor(z * (y+1));
  } else {
    result = trained === 1 ? 0 : Math.floor(z * y);
  }
  return result;
}

export {
  addWord,
  updateWord,
  deleteWord,
  deleteAllWords,
  addCSV,
  updateProgress
}
