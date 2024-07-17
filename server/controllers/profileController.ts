import { Request, Response } from "express";
import User from "../models/User";

async function profileController(req, res: Response) {
  const foundUser = await User.findOne({ _id: req.userInfo._id }).exec();
  if (!foundUser) {
    return res.status(204).json({ msg: `User ID ${req.userInfo._id} not found`});
  }
  res.json({ username: foundUser.username, wordsPerLesson: foundUser.wordsPerLesson });
}

export default profileController;
