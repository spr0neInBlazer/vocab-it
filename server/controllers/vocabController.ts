import { Response } from "express";
import Vocabulary from "../models/Vocabulary";
import User from "../models/User";
import { LangCodes } from "../types";

async function getVocabs(req, res: Response) {
  try {
    const foundUser = await User.findById(req.userInfo._id).populate('vocabularies').exec();
    if (!foundUser) {
      return res.status(404).json({ msg: `User ${req.userInfo.username} not found`});
    }

    res.status(200).json({
      vocabularies: foundUser.vocabularies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function addVocab(req, res: Response) {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ msg: 'Invalid "title" property' });
    }

    const duplicate = await Vocabulary.findOne({ title }).where({ user: req.userInfo._id });
    if (duplicate) {
      return res.status(409).json({ msg: 'Vocabulary with this name already exists' });
    }

    const newVocab = await Vocabulary.create({
      "title": title,
      "userId": req.userInfo._id
    });
    const foundUser = await User.findById(req.userInfo._id).exec();
    const updatedVocabs = [...foundUser.vocabularies, newVocab._id];
    foundUser.vocabularies = updatedVocabs;
    await foundUser.save();
    await foundUser.populate('vocabularies');
    return res.status(201).json({ 
      vocabularies: foundUser.vocabularies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function getVocab(req, res: Response) {
  try {
    const foundVocab = await Vocabulary.findById(req.body._id).lean();
    if (!foundVocab) {
      return res.status(400).json({ msg: 'Vocabulary not found' });
    }

    const { _id, title, words, lang } = foundVocab;
    return res.status(200).json({ _id, title, words, lang });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function updateTitle(req, res: Response) {
  try {
    const { _id, title } = req.body;
    if (!title) {
      return res.status(400).json({ msg: 'Invalid title property' });
    }

    const duplicate = await Vocabulary.findOne({ title }).where({ user: req.userInfo._id });
    if (duplicate) {
      return res.status(409).json({ msg: 'Vocabulary with this name already exists' });
    }
    
    const vocabToUpdate = await Vocabulary.findByIdAndUpdate(_id, { title });
    if (!vocabToUpdate) {
      return res.status(409).json({ msg: 'Invalid vocab ID' });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

const validLangCodes: LangCodes[] = ['FRA', 'GER', 'SPA', 'default'];

async function updateLang(req, res: Response) {
  try {
    const { vocabId, updatedLang } = req.body;
    if (!validLangCodes.includes(updatedLang)) {
      return res.status(400).json({ msg: 'Invalid title property' });
    }

    const vocabToUpdate = await Vocabulary.findByIdAndUpdate(vocabId, { lang: updatedLang }, { new: true });
    if (!vocabToUpdate) {
      return res.status(409).json({ msg: 'Invalid vocab ID' });
    }

    const { _id, title, words, lang } = vocabToUpdate;
    return res.status(200).json({ _id, title, words, lang });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function deleteVocab(req, res: Response) {
  try {
    const { _id } = req.body;
    await Vocabulary.findByIdAndDelete(_id);
    const userToUpdate = await User.findById(req.userInfo._id).exec();
    const updatedVocabs = userToUpdate.vocabularies.filter(vocab => vocab._id.toString() !== _id);
    userToUpdate.vocabularies = updatedVocabs;
    await userToUpdate.save();
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

export {
  getVocabs,
  addVocab,
  getVocab,
  updateTitle,
  updateLang,
  deleteVocab
}
