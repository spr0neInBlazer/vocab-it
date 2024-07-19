import { Request, Response } from "express";
import User from "../models/User";

interface CustomRequest extends Request {
  userInfo: {
    _id: string;
  }
}

async function getProfile(req: CustomRequest, res: Response) {
  try {
    const foundUser = await User.findOne({ _id: req.userInfo._id }).exec();
    if (!foundUser) {
      return res.status(404).json({ msg: `User ID ${req.userInfo._id} not found`});
    }
    res.status(200).json({ username: foundUser.username, wordsPerLesson: foundUser.wordsPerLesson });
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
      return res.status(404).json({ msg: `User ID ${req.userInfo._id} not found`});
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateWordsPerLesson(req, res: Response) {
  const { wordsPerLesson } = req.body;
  try {
    if (wordsPerLesson < 1 || isNaN(wordsPerLesson) || !Number.isInteger(wordsPerLesson)) {
      return res.status(400).json({ msg: `Invalid property value`});
    }

    const updatedUser = await User.findByIdAndUpdate(req.userInfo._id, { wordsPerLesson });
    if (!updatedUser) {
      return res.status(404).json({ msg: `User ID ${req.userInfo._id} not found`});
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

async function deleteAccount(req, res: Response) {
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
