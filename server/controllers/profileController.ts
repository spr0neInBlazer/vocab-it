import { Response } from "express";
import User from "../models/User";
import { CustomRequest } from "../types";

async function getProfile(req: CustomRequest, res: Response) {
  try {
    const foundUser = await User.findById(req.userInfo._id).exec();
    if (!foundUser) {
      return res.status(404).json({ msg: `User ${req.userInfo.username} not found`});
    }

    res.status(200).json({ 
      username: foundUser.username, 
      vocabularies: foundUser.vocabularies,
      wordsPerLesson: foundUser.wordsPerLesson 
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

async function updateWordsPerLesson(req: CustomRequest, res: Response) {
  const { wordsPerLesson } = req.body;
  try {
    if (wordsPerLesson < 1 || isNaN(wordsPerLesson) || !Number.isInteger(wordsPerLesson)) {
      return res.status(400).json({ msg: `Invalid property value`});
    }

    const updatedUser = await User.findByIdAndUpdate(req.userInfo._id, { wordsPerLesson });
    if (!updatedUser) {
      return res.status(404).json({ msg: `User with ID ${req.userInfo._id} not found`});
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function deleteAccount(req: CustomRequest, res: Response) {
  try {
    const userToDelete = await User.findByIdAndDelete(req.userInfo._id);
    if (!userToDelete) {
      return res.status(404).json({ msg: `User ID ${req.userInfo._id} not found`});
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

export {
  getProfile,
  updateUsername,
  updateWordsPerLesson,
  deleteAccount
};
