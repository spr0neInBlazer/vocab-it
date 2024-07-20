import { Response } from "express";
import Vocabulary from "../models/Vocabulary";
import { v4 as uuidv4 } from 'uuid';

async function addWord(req, res: Response) {
  try {
    const { _id, word, translation } = req.body;
    if (!word || !translation) {
      return res.status(400).json({ msg: 'Invalid word properties' });
    }

    const vocabToUpdate = await Vocabulary.findById(_id).exec();
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

export {
  addWord
}
