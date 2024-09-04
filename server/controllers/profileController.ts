import { Response } from "express";
import User from "../models/User";
import { CustomRequest } from "../types";
import Vocabulary from "../models/Vocabulary";

async function getProfile(req: CustomRequest, res: Response) {
  try {
    const foundUser = await User.findById(req.userInfo._id).populate('vocabularies').exec();
    if (!foundUser) {
      return res.status(404).json({ msg: `User ${req.userInfo.username} not found`});
    }

    res.status(200).json({ 
      username: foundUser.username, 
      vocabularies: foundUser.vocabularies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateUsername(req: CustomRequest, res: Response) {
  const { username } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(req.userInfo._id, { username });
    if (!updatedUser) {
      console.log('user not found');
      return res.status(404).json({ msg: `User with ID ${req.userInfo._id} not found`});
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function deleteAccount(req: CustomRequest, res: Response) {
  try {
    const userToDelete = await User.findByIdAndDelete(req.userInfo._id);
    if (!userToDelete) {
      return res.status(404).json({ msg: `User ID ${req.userInfo._id} not found`});
    }

    // remove all user's vocabs
    await Vocabulary.deleteMany({ userId: req.userInfo._id });
    
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

export {
  getProfile,
  updateUsername,
  deleteAccount
};
