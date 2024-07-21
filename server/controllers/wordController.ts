import { Request, Response } from "express";
import Vocabulary from "../models/Vocabulary";
import { v4 as uuidv4 } from 'uuid';

async function addWord(req: Request, res: Response) {
  try {
    const { _id, word, translation } = req.body;
    if (!word || !translation) {
      return res.status(400).json({ msg: 'Invalid word properties' });
    }

    const vocabToUpdate = await Vocabulary.findById(_id).exec();
    const duplicate = vocabToUpdate.words.find(w => w.word === word);
    if (duplicate) {
      return res.send(409).json({ msg: 'This word is already in the vocabulary' });
    }

    const newWord = {
      _id: uuidv4(),
      word,
      translation
    };
    vocabToUpdate.words = [...vocabToUpdate.words, newWord];
    await vocabToUpdate.save();
    res.status(201).json({ words: vocabToUpdate.words });
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
    if (duplicate) {
      return res.send(409).json({ msg: 'This word is already in the vocabulary' });
    }

    const wordToUpdate = vocabToUpdate.words.find(w => w._id === wordId);
    if (!wordToUpdate) {
      return res.status(404).json({ msg: 'Word not found' });
    }
    
    wordToUpdate.word = word;
    wordToUpdate.translation = translation;
    await vocabToUpdate.save();
    res.status(200).json({ words: vocabToUpdate.words });
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
    res.status(200).json({ words: vocabToUpdate.words });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function deleteAllWords(req: Request, res: Response) {
  try {
    if (!req.body._id) {
      return res.status(400).json({ msg: '/"_id/" property not found'});
    }

    const vocabToUpdate = await Vocabulary.findByIdAndUpdate(req.body._id, { words: []});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function addCSV(req: Request, res: Response) {
  try {
    // fiure out whether to read file on the client or the server
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

export {
  addWord,
  updateWord,
  deleteWord,
  deleteAllWords
}
