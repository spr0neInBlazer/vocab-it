import { Request, Response } from "express";
import Vocabulary from "../models/Vocabulary";
import User from "../models/User";

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
      // "_id": uuidv4(),
      "title": title,
      "userId": req.userInfo._id
    });
    const foundUser = await User.findById(req.userInfo._id).exec();
    const updatedVocabs = [...foundUser.vocabularies, newVocab._id];
    foundUser.vocabularies = updatedVocabs;
    await foundUser.save();
    await foundUser.populate('vocabularies');
    res.status(201).json({ 
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

    const { _id, title, words } = foundVocab;
    res.status(200).json({ _id, title, words });
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
  deleteVocab
}
