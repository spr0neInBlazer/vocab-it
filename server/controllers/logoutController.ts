import { Request, Response } from "express";
import User from "../models/User";

async function handleLogout(req: Request, res: Response) {
  const cookies = req.cookies;
  try {
    if (!cookies.jwt) {
      return res.sendStatus(204); // No content sent
    }
  
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true});
      return res.sendStatus(204);
    }
    
    foundUser.refreshToken = '';
    await foundUser.save();
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true});
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

export default handleLogout;
