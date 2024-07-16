import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function handleLogin(req: Request, res: Response) {
  const { username, pwd } = req.body;
  if (!username || !pwd) {
    return res.status(400).json({ 'message': 'Username and password are required'});
  }

  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) {
    return res.sendStatus(401); // Unauthorized
  }

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!refreshSecret || !accessSecret) {
      throw new Error('Token secrets are not defined');
    }

    const roles = Object.values(foundUser.roles).filter(Boolean);
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles
        }
      },
      accessSecret, { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      refreshSecret,
      { expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24*60*60*1000});
    res.status(201).json({ 'message': 'User logged in', accessToken });
  } else {
    return res.sendStatus(401);
  }
} 

export default handleLogin;
