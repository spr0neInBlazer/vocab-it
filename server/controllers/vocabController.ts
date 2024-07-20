import { Response } from "express";
import Vocabulary from "../models/Vocabulary";
import User from "../models/User";

async function addVocab(req, res: Response) {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ msg: 'Invalid "title" property' });
    }

    const duplicate = await Vocabulary.findOne({ title }).where({ user: req.userInfo._id });
    if (duplicate) {
      return res.send(409).json({ msg: 'Vocabulary with this name already exists' });
    }

    const newVocab = await Vocabulary.create({
      "title": title,
      "userId": req.userInfo._id
    });
    const foundUser = await User.findById(req.userInfo._id).exec();
    const updatedVocabs = [...foundUser.vocabularies, newVocab._id];
    foundUser.vocabularies = updatedVocabs;
    await foundUser.save();
    await foundUser.populate('vocabularies')
    res.status(201).json({ 
      _id: foundUser._id,
      vocabularies: foundUser.vocabularies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function getVocab(req, res: Response) {
  try {
    const foundVocab = await Vocabulary.findById(req.body._id).exec();
    if (!foundVocab) {
      return res.status(400).json({ msg: 'Invalid title property' });
    }

    const { _id, title, userId, words } = foundVocab;
    res.status(200).json({ _id, title, userId, words });
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
      return res.send(409).json({ msg: 'Vocabulary with this name already exists' });
    }

    const updatedVocab = await Vocabulary.findByIdAndUpdate(_id, { title });
    res.sendStatus(204);
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
    const updatedVocabs = userToUpdate.vocabularies.filter(vocab => vocab._id !== _id);
    userToUpdate.vocabularies = updatedVocabs;
    await userToUpdate.save();
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

export {
  addVocab,
  getVocab,
  updateTitle,
  deleteVocab
}
